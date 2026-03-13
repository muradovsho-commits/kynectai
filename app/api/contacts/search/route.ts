import { NextResponse } from "next/server";

type Contact = {
  initials: string;
  gradient?: string;
  name: string;
  role?: string;
  firm?: string;
  location?: string;
  school?: string;
  email?: string;
  linkedinUrl?: string;
  background?: string;
  intel?: string;
  s1?: string;
  s2?: string;
  s3?: string;
  hasEmail?: boolean;
  hasLinkedin?: boolean;
  verified?: boolean;
};

export async function POST(request: Request) {
  const { query } = await request.json().catch(() => ({ query: "" }));

  const contacts: Contact[] = [
    {
      initials: "EZ",
      gradient: "linear-gradient(135deg,#667eea,#764ba2)",
      name: "Emily Zhang",
      role: "IB Analyst · TMT Coverage",
      firm: "Goldman Sachs",
      location: "New York, NY",
      school: "UMich Ross '23",
      email: "e.zhang@gs.com",
      linkedinUrl: "linkedin.com/in/emily-zhang-gs",
      background:
        "UMich Ross '23 · IBC President · 2 yrs at Goldman TMT. Focused on semiconductor and software M&A. Previously interned at William Blair Chicago.",
      intel:
        "Emily is a 2nd-year IB Analyst in Goldman's TMT coverage group, focused on semiconductor and software M&A. She graduated from UMich Ross in 2023, was IBC President, and has been active in public commentary on deal structuring. She responds well to specific deal references.",
      s1: "Ask about her path from UMich Ross IBC into Goldman's TMT group.",
      s2: "Reference her recent semiconductor M&A coverage — she's been active in that space.",
      s3: "Mention her William Blair internship as a shared data point if you're targeting similar firms.",
      hasEmail: true,
      hasLinkedin: true,
      verified: true,
    },
    {
      initials: "MC",
      gradient: "linear-gradient(135deg,#f59e0b,#ef4444)",
      name: "Marcus Chen",
      role: "IB Analyst · FIG",
      firm: "Goldman Sachs",
      location: "New York, NY",
      school: "Wharton '22",
      email: "m.chen@gs.com",
      linkedinUrl: "linkedin.com/in/marcus-chen-gs",
      background:
        "Wharton '22 · Former Penn Capital Markets Club VP. 3 yrs at Goldman FIG, covering insurance and asset management M&A.",
      intel:
        "Marcus is a 3rd-year IB Analyst in Goldman's FIG group, covering insurance and asset management. He graduated from Wharton in 2022 and was VP of Penn Capital Markets Club. Shared interest in fintech disruption of traditional FIG deals.",
      s1: "Reference his Wharton background and Capital Markets Club — strong common ground.",
      s2: "Ask about the FIG M&A cycle and what types of deals his team has been working on.",
      s3: "Mention any fintech or insurtech coverage you've followed — he's vocal about that intersection.",
      hasEmail: true,
      hasLinkedin: true,
      verified: true,
    },
    {
      initials: "SP",
      gradient: "linear-gradient(135deg,#22c55e,#16a34a)",
      name: "Sarah Park",
      role: "IB Analyst · Healthcare",
      firm: "Goldman Sachs",
      location: "New York, NY",
      school: "Columbia '23",
      email: "s.park@gs.com",
      linkedinUrl: "linkedin.com/in/sarah-park-gs",
      background:
        "Columbia '23 · Pre-med turned IB. Goldman Healthcare group covering pharma and biotech M&A. Active mentor in Columbia's IB club.",
      intel:
        "Sarah made an interesting pivot from pre-med to IB and is now covering pharma and biotech M&A at Goldman. She's an active mentor in Columbia's IB club and was a summer analyst at Jefferies before Goldman.",
      s1: "Lead with the Columbia IB club connection — she's actively mentoring there.",
      s2: "Ask about her pivot from pre-med and how the healthcare background shapes her coverage.",
      s3: "Reference any pharma or biotech deal news as a specific conversation opener.",
      hasEmail: true,
      hasLinkedin: true,
      verified: true,
    },
  ];

  return NextResponse.json({
    query,
    title: query || "Search results",
    meta: `${contacts.length} contacts found`,
    contacts,
  });
}

