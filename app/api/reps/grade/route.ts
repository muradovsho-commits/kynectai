import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse, checkRateLimit, getClientIP, getCorsHeaders } from "../../_lib/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Reps grading endpoint.
//
// Accepts a multipart/form-data upload with:
//   - file: the student's artifact (.xlsx / .docx / .pdf / .pptx)
//   - scenarioContext: the scenario's world
//   - artifactPrompt: what was asked
//   - artifactRubric: the grading criteria
//   - artifactFormat: 'xlsx' | 'docx' | 'pdf' | 'pptx'
//   - graderPersona: JSON of the persona doing the grading (voice/style)
//
// Parses the file server-side using xlsx (Excel) and mammoth (Word). PDFs
// are parsed via pdf-parse. PPTX is unzipped and slide XML extracted.
// The extracted content + rubric goes to the AI, which grades on craft and
// returns structured feedback + per-dimension scores.
//
// This is the heart of Reps. The UI is a costume; this is what makes the
// product real.
// ─────────────────────────────────────────────────────────────────────────────

export const runtime = "nodejs";   // we need Node APIs for file parsing
export const dynamic = "force-dynamic";
// Vercel function timeout — 60s gives Gemini room. On hobby tier the
// effective cap is lower; if you see 504s here, upgrade or move to streaming.
export const maxDuration = 60;

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

// Max raw file size we accept (in bytes). Vercel has its own ~4.5MB body cap.
const MAX_FILE_BYTES = 4 * 1024 * 1024;

// Max chars of parsed content we pass to the LLM. Past this we get truncated
// without warning; better to trim ourselves and tell the model we did.
const MAX_PARSED_CHARS = 24000;

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  try {
    const userId = getAuthUserId(req);
    if (!userId) return unauthorizedResponse(corsHeaders);

    const ip = getClientIP(req);
    const limited = checkRateLimit(`reps-grade:${userId || ip}`, 10, 60_000, corsHeaders);
    if (limited) return limited;

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const scenarioContext = (form.get("scenarioContext") as string) || "";
    const artifactPrompt = (form.get("artifactPrompt") as string) || "";
    const artifactRubric = (form.get("artifactRubric") as string) || "";
    const artifactFormat = (form.get("artifactFormat") as string) || "";
    const graderPersonaRaw = (form.get("graderPersona") as string) || "{}";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400, headers: corsHeaders });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: `File too large (${Math.round(file.size / 1024)}KB). Max 4 MB.` }, { status: 400, headers: corsHeaders });
    }
    if (!artifactRubric) {
      return NextResponse.json({ error: "Missing artifact rubric" }, { status: 400, headers: corsHeaders });
    }

    let graderPersona: { name?: string; title?: string; firm?: string; style?: string } = {};
    try { graderPersona = JSON.parse(graderPersonaRaw); } catch {}

    // Parse the file into a text/structured representation the model can
    // grade against. Each format has its own parser; they all converge on
    // a string blob with enough fidelity for the AI to cite specifics.
    const buf = Buffer.from(await file.arrayBuffer());
    let parsedContent = "";
    try {
      if (artifactFormat === "xlsx" || file.name.match(/\.(xlsx|xls|xlsm)$/i)) {
        parsedContent = await parseXlsx(buf);
      } else if (artifactFormat === "docx" || file.name.match(/\.docx$/i)) {
        parsedContent = await parseDocx(buf);
      } else if (artifactFormat === "pdf" || file.name.match(/\.pdf$/i)) {
        parsedContent = await parsePdf(buf);
      } else if (artifactFormat === "pptx" || file.name.match(/\.pptx$/i)) {
        parsedContent = await parsePptx(buf);
      } else {
        return NextResponse.json({ error: "Unsupported file type" }, { status: 400, headers: corsHeaders });
      }
    } catch (parseErr: any) {
      console.error("[reps-grade] parse error:", parseErr?.message || parseErr);
      return NextResponse.json({ error: "Could not read this file. Make sure it isn't corrupted or password-protected." }, { status: 400, headers: corsHeaders });
    }

    if (!parsedContent || parsedContent.trim().length < 20) {
      return NextResponse.json({ error: "File appears empty. Please upload a completed deliverable." }, { status: 400, headers: corsHeaders });
    }

    // Trim if huge.
    let contentForAI = parsedContent;
    let truncated = false;
    if (contentForAI.length > MAX_PARSED_CHARS) {
      contentForAI = contentForAI.slice(0, MAX_PARSED_CHARS);
      truncated = true;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500, headers: corsHeaders });
    }

    // Build the grading prompt. The model gets the scenario world, what was
    // asked, the rubric, the parsed file, and the persona it must speak as.
    const personaName = graderPersona.name || "Senior reviewer";
    const personaTitle = graderPersona.title || "Senior";
    const personaFirm = graderPersona.firm || "the firm";
    const personaStyle = graderPersona.style || "Direct, exacting, time-poor.";

    const systemPrompt = `You are ${personaName}, ${personaTitle} at ${personaFirm}, reviewing a first-year analyst's work product. Stay in this character throughout — match the voice and style below — but your judgment must be technically accurate.

YOUR STYLE
${personaStyle}

SCENARIO CONTEXT
${scenarioContext}

WHAT YOU ASKED THE ANALYST TO PRODUCE
${artifactPrompt}

YOUR GRADING RUBRIC (apply this exactly — score each dimension 1-10, then write the verdict)
${artifactRubric}

THE ANALYST'S ACTUAL SUBMISSION (parsed from their .${artifactFormat} file${truncated ? ' — TRUNCATED to fit context, grade based on what is shown' : ''})
${contentForAI}

YOUR JOB
Grade the submission against the rubric. Be specific. Cite cells, columns, sections, or sentences directly. Do NOT be vague. Do NOT soften feedback to be nice. If a number is wrong, say what should be there and why. If a peer doesn't belong, say which and why.

OUTPUT FORMAT — STRICT JSON, no markdown fences:
{
  "scores": {
    "<rubric dimension name in snake_case>": <integer 1-10>,
    ...one entry per scored dimension in the rubric...
  },
  "feedback": "<your spoken feedback in YOUR voice as ${personaName}. 2-4 paragraphs. Reference specific cells/sections/numbers. End with one of: 'Send it.', 'One more pass.', or 'Full redo.'>"
}

Do not output anything outside the JSON object.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Grade the submission above." }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.4,    // grading should be relatively deterministic
          topP: 0.9,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("[reps-grade] gemini error:", geminiRes.status, errText.slice(0, 300));
      return NextResponse.json({ error: "AI service error" }, { status: 502, headers: corsHeaders });
    }

    const data = await geminiRes.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed: { scores?: Record<string, number>; feedback?: string } = {};
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      try { parsed = JSON.parse(cleaned); } catch {}
    }

    if (!parsed.feedback) {
      // Fallback — surface the raw text rather than fail silently.
      parsed.feedback = rawText.slice(0, 2000) || "Grader produced no output.";
    }
    if (!parsed.scores || typeof parsed.scores !== "object") {
      parsed.scores = {};
    }

    return NextResponse.json({
      feedback: parsed.feedback,
      scores: parsed.scores,
      meta: { parsedChars: contentForAI.length, truncated },
    }, { headers: corsHeaders });
  } catch (e: any) {
    console.error("[reps-grade] error:", e?.message || e);
    return NextResponse.json({ error: "Grading failed: " + (e?.message || "unknown") }, { status: 500, headers: getCorsHeaders(req) });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// File parsers — each returns a string blob suitable for an LLM to read.
// We aim for "the AI can cite a cell/section by name", not perfect fidelity.
// ─────────────────────────────────────────────────────────────────────────────

async function parseXlsx(buf: Buffer): Promise<string> {
  // Dynamic import — xlsx is heavy and only needed when an Excel file is up.
  // @ts-expect-error  — xlsx ships its own types but TS can be picky about the way it loads at runtime.
  const XLSX = await import("xlsx");
  const wb = XLSX.read(buf, { type: "buffer", cellFormula: true, cellNF: true, cellDates: true });

  const out: string[] = [];
  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) continue;
    out.push(`=== Sheet: ${sheetName} ===`);

    // Get the used range.
    const ref = sheet["!ref"];
    if (!ref) { out.push("(empty sheet)"); continue; }
    const range = XLSX.utils.decode_range(ref);

    // Build a CSV-ish dump with formulas annotated. We cap rows/cols so a
    // huge sheet doesn't blow our token budget — Reps deliverables are
    // small enough that 60x30 covers them.
    const maxRows = Math.min(range.e.r - range.s.r + 1, 80);
    const maxCols = Math.min(range.e.c - range.s.c + 1, 40);

    for (let r = 0; r < maxRows; r++) {
      const rowOut: string[] = [];
      for (let c = 0; c < maxCols; c++) {
        const cellAddr = XLSX.utils.encode_cell({ r: range.s.r + r, c: range.s.c + c });
        const cell = sheet[cellAddr];
        if (!cell) {
          rowOut.push("");
          continue;
        }
        // Show formula in braces when present, otherwise the value.
        if (cell.f) {
          rowOut.push(`${cellAddr}={=${cell.f}}[${cell.v ?? ""}]`);
        } else if (cell.v !== undefined && cell.v !== null && cell.v !== "") {
          rowOut.push(`${cellAddr}=${cell.v}`);
        } else {
          rowOut.push("");
        }
      }
      // Drop rows that are entirely empty so dumps stay compact.
      if (rowOut.some(x => x !== "")) out.push(rowOut.filter(x => x !== "").join(" | "));
    }
  }

  return out.join("\n");
}

async function parseDocx(buf: Buffer): Promise<string> {
  // @ts-expect-error  — mammoth doesn't bundle clean types; safe at runtime.
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer: buf });
  return result.value || "";
}

async function parsePdf(buf: Buffer): Promise<string> {
  // pdf-parse exports a default function — load it dynamically.
  // @ts-expect-error
  const pdfMod = await import("pdf-parse/lib/pdf-parse.js");
  const pdfParse = pdfMod.default || pdfMod;
  const data = await pdfParse(buf);
  return data.text || "";
}

async function parsePptx(buf: Buffer): Promise<string> {
  // PPTX is a zip with slide XML files. We unzip in-memory with jszip and
  // pull text from each slideN.xml. This gets us slide titles and body text;
  // images/charts are skipped (Reps grades on text content for now).
  // @ts-expect-error
  const JSZipMod = await import("jszip");
  const JSZip = JSZipMod.default || JSZipMod;
  const zip = await JSZip.loadAsync(buf);

  // Slides live at ppt/slides/slide1.xml, slide2.xml, etc.
  const slideFiles = Object.keys(zip.files).filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort();
  const out: string[] = [];

  for (const name of slideFiles) {
    const slideNum = name.match(/slide(\d+)/)?.[1] || "?";
    const xml = await zip.files[name].async("string");
    // Pull <a:t>...</a:t> text runs (PowerPoint stores visible text here).
    const texts = Array.from(xml.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g)).map(m => m[1]);
    out.push(`=== Slide ${slideNum} ===`);
    out.push(texts.join("\n"));
  }

  return out.join("\n\n");
}
