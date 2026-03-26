const apiKey = "AIzaSyALdXl4lOe5VxPTb30zTa7V46JjM3PdroI";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const prompt = `You are a finance market analyst for college students preparing for Wall Street interviews.

Analyze these news headlines. For each, provide analysis relevant to finance recruiting.

Headlines:
1. [Google News] The payment system puts a floor on the Fed’s balance sheet
2. [Google News] Trade War and the Dollar Anchor

For each headline return:
- title: cleaned headline text
- summary: 1 sentence plain English summary
- ib: how this affects investment banking
- quant: how this affects quant
- trading: broader market implications
- tags: assign 1-2 tags from EXACTLY these options: Macro, Equities
- heat: high, medium, or low

Return ONLY a JSON array. Example format:
[{"title":"...","summary":"...","ib":"...","quant":"...","trading":"...","tags":["Macro","Equities"],"heat":"high"}]
IMPORTANT: Ensure ALL strings are properly JSON escaped.`;

async function run() {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4096,
        responseMimeType: "application/json"
      },
    }),
  });
  
  const text = await res.text();
  console.log(text);
}
run();
