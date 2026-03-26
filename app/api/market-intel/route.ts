import { NextResponse } from "next/server";

const RSS_FEEDS = [
  { url: "https://news.google.com/rss/search?q=finance+markets+economy&hl=en-US&gl=US&ceid=US:en", source: "Google News" },
  { url: "https://news.google.com/rss/search?q=investment+banking+wall+street+deals&hl=en-US&gl=US&ceid=US:en", source: "Google News" },
  { url: "https://news.google.com/rss/search?q=federal+reserve+interest+rates+bonds&hl=en-US&gl=US&ceid=US:en", source: "Google News" },
  { url: "https://news.google.com/rss/search?q=stocks+equities+earnings&hl=en-US&gl=US&ceid=US:en", source: "Google News" },
  { url: "https://news.google.com/rss/search?q=hedge+fund+private+equity+M%26A&hl=en-US&gl=US&ceid=US:en", source: "Google News" },
  { url: "https://www.cnbc.com/id/100003114/device/rss/rss.html", source: "CNBC" },
];

async function fetchRSS(feedUrl: string, source: string) {
  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 900 },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; OfferBell/1.0)" },
    });
    if (!res.ok) return [];
    const text = await res.text();
    const items: { title: string; link: string; source: string; pubDate: string }[] = [];
    const itemMatches = text.match(/<item>([\s\S]*?)<\/item>/g) || [];
    for (const item of itemMatches.slice(0, 5)) {
      const title =
        item.match(/<title><!\[CDATA\[(.*?)\]\]>/)?.[1] ||
        item.match(/<title>(.*?)<\/title>/)?.[1] ||
        "";
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      if (title) items.push({ title: title.trim(), link, source, pubDate });
    }
    return items;
  } catch {
    return [];
  }
}

async function analyzeHeadlines(headlines: { title: string; source: string }[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || headlines.length === 0) return null;

  const list = headlines.map((h, i) => `${i + 1}. [${h.source}] ${h.title}`).join("\n");

  const prompt = `You are a finance market analyst for college students preparing for Wall Street interviews.

Analyze these news headlines. For each, provide analysis relevant to finance recruiting.

Headlines:
${list}

For each headline return:
- title: cleaned headline text
- summary: 1 sentence plain English summary
- ib: how this affects investment banking (deals, M&A, IPOs, advisory)
- quant: how this affects quant trading and systematic strategies  
- trading: broader market and trading implications
- tags: assign 1-2 tags from EXACTLY these options: Macro, Equities, Fixed Income, Volatility, Firms, Geopolitical
- heat: high, medium, or low based on how important this is for a finance interview

Pick the 8 most important headlines. Ensure a MIX of tags — not all Macro. Include Equities, Fixed Income, Firms, Geopolitical where relevant.

Return ONLY a JSON array. No explanation, no markdown. Example format:
[{"title":"...","summary":"...","ib":"...","quant":"...","trading":"...","tags":["Macro","Equities"],"heat":"high"}]`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini error:", res.status, err.slice(0, 500));
      return null;
    }

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Extract JSON from response — handle markdown wrapping
    let jsonStr = raw;
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (jsonMatch) jsonStr = jsonMatch[0];
    else jsonStr = raw.replace(/```json\n?|```\n?/g, "").trim();
    
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    console.error("Gemini parse error:", e);
    return null;
  }
}

export async function GET() {
  try {
    const allFeeds = await Promise.all(
      RSS_FEEDS.map((f) => fetchRSS(f.url, f.source))
    );
    const allHeadlines = allFeeds.flat();

    // Deduplicate by title similarity
    const seen = new Set<string>();
    const unique = allHeadlines.filter((h) => {
      const key = h.title.toLowerCase().slice(0, 40);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 20);

    if (unique.length === 0) {
      return NextResponse.json({ stories: [], error: "No headlines available" });
    }

    const analyzed = await analyzeHeadlines(unique);

    if (analyzed && analyzed.length > 0) {
      const stories = analyzed.map((a: any, i: number) => ({
        title: a.title || unique[i]?.title || "",
        summary: a.summary || "",
        impact: {
          ib: a.ib || "",
          quant: a.quant || "",
          trading: a.trading || "",
        },
        tags: Array.isArray(a.tags) ? a.tags : ["Macro"],
        heat: a.heat || "medium",
        link: unique[i]?.link || "",
        source: unique[i]?.source || "",
        pubDate: unique[i]?.pubDate || "",
      }));
      return NextResponse.json({ stories });
    }

    // Fallback: raw headlines without analysis
    const fallback = unique.slice(0, 8).map((h) => ({
      title: h.title,
      summary: "",
      impact: { ib: "", quant: "", trading: "" },
      tags: ["Macro"],
      heat: "medium",
      link: h.link,
      source: h.source,
      pubDate: h.pubDate,
    }));
    return NextResponse.json({ stories: fallback });
  } catch (error) {
    console.error("Market intel error:", error);
    return NextResponse.json({ stories: [], error: "Failed to load" }, { status: 500 });
  }
}
