import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.PDL_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "NO KEY", env: Object.keys(process.env).filter(k => k.includes("PDL")) });

  try {
    const res = await fetch("https://api.peopledatalabs.com/v5/person/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
      body: JSON.stringify({ query: { bool: { must: [{ term: { job_company_name: "goldman sachs" } }] } }, size: 2 }),
    });
    const text = await res.text();
    return NextResponse.json({ status: res.status, body: text.slice(0, 500) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg });
  }
}
