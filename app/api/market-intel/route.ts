import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const RSS_FEEDS = [
  { url: "https://feeds.reuters.com/reuters/businessNews", source: "Reuters" },
  { url: "https://feeds.reuters.com/reuters/topNews", source: "Reuters" },
  { url: "https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC&region=US&lang=en-US", source: "Yahoo Finance" },
];

async function fetchRSS(feedUrl: string, source: string): Promise<{ title: string; link: string; source: string; pubDate: string }[]> {
  try {
    const res = await fetch(feedUrl, { next: { revalidate: 900 } }); // cache 15 min
    if (!res.ok) return [];
    const text = await res.text();
    const items: { title: string; link: string; source: string; pubDate: string }[] = [];
    const itemMatches = text.match(/<item>([\s\S]*?)<\/item>/g) || [];
    for (const item of itemMatches.slice(0, 5)) {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      if (title) items.push({ title: title.trim(), link, source, pubDate });
    }
    return items;
  } catch {
    return [];
  }
}

async function analyzeWithGemini(headlines: { title: string; source: string }[]): Promise<any[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || headlines.length === 0) return [];

  const headlineList = headlines.map((h, i) => `${i + 1}. [${h.source}] ${h.title}`).join("\n");

  const prompt = `You are a finance market analyst. Analyze these headlines and return ONLY valid JSON (no markdown, no backticks).

Headlines:
${headlineList}

Return a JSON array where each item has:
- "title": the headline (cleaned up)
- "summary": 1 sentence summary
- "impact": object with "ib" (investment banking impact), "quant" (quant/trading impact), "trading" (market impact) — each 1 short sentence
- "tags": array of tags from: ["Macro", "Equities", "Fixed Income", "Volatility", "Firms", "Geopolitical", "Explainer"]
- "heat": "high", "medium", or "low" based on market significance

Only include the 6 most important headlines. Return ONLY the JSON array, nothing else.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = text.replace(/```json\n?|```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Gemini market analysis error:", e);
    return [];
  }
}

export async function GET() {
  try {
    // Fetch all RSS feeds in parallel
    const allFeeds = await Promise.all(
      RSS_FEEDS.map((f) => fetchRSS(f.url, f.source))
    );
    const allHeadlines = allFeeds.flat().slice(0, 15);

    if (allHeadlines.length === 0) {
      return NextResponse.json({ stories: [], error: "No headlines fetched" }, { headers: corsHeaders });
    }

    // Analyze with Gemini
    const analyzed = await analyzeWithGemini(allHeadlines);

    // Merge links back
    const stories = analyzed.map((a, i) => ({
      ...a,
      link: allHeadlines[i]?.link || "",
      source: allHeadlines[i]?.source || "",
      pubDate: allHeadlines[i]?.pubDate || "",
    }));

    return NextResponse.json({ stories }, { headers: corsHeaders });
  } catch (error) {
    console.error("Market intel error:", error);
    return NextResponse.json({ stories: [], error: "Failed to fetch market intelligence" }, { status: 500, headers: corsHeaders });
  }
}
