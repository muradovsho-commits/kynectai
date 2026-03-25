import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ 
      status: "NO_KEY", 
      message: "GEMINI_API_KEY is not set in environment",
      allEnvKeys: Object.keys(process.env).filter(k => k.includes("GEMINI") || k.includes("gemini"))
    });
  }

  // Test the key against Gemini
  const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
  const results: any[] = [];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Say hello in one word." }] }],
          generationConfig: { maxOutputTokens: 10 },
        }),
      });
      const body = await res.text();
      results.push({ model, status: res.status, response: body.slice(0, 300) });
      if (res.ok) break;
    } catch (err: any) {
      results.push({ model, status: "FETCH_ERROR", error: err.message });
    }
  }

  return NextResponse.json({
    status: "KEY_EXISTS",
    keyPrefix: apiKey.slice(0, 6) + "...",
    keyLength: apiKey.length,
    results,
  });
}
