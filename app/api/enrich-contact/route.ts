import { NextRequest, NextResponse } from "next/server";

const APOLLO_MATCH_URL = "https://api.apollo.io/api/v1/people/match";

const FIRM_EMAIL_FORMATS: Record<string, string> = {
  "goldman sachs": "{first}.{last}@gs.com",
  "jp morgan": "{first}.{last}@jpmorgan.com",
  "jpmorgan": "{first}.{last}@jpmorgan.com",
  "jpmorgan chase": "{first}.{last}@jpmorgan.com",
  "morgan stanley": "{first}.{last}@morganstanley.com",
  "bank of america": "{first}.{last}@bofa.com",
  "bofa securities": "{first}.{last}@bofa.com",
  "citigroup": "{first}.{last}@citi.com",
  "citi": "{first}.{last}@citi.com",
  "barclays": "{first}.{last}@barclays.com",
  "ubs": "{first}.{last}@ubs.com",
  "deutsche bank": "{first}.{last}@db.com",
  "credit suisse": "{first}.{last}@credit-suisse.com",
  "hsbc": "{first}.{last}@hsbc.com",
  "wells fargo": "{first}.{last}@wellsfargo.com",
  "blackstone": "{first}.{last}@blackstone.com",
  "kkr": "{first}.{last}@kkr.com",
  "apollo global": "{first}.{last}@apollo.com",
  "apollo global management": "{first}.{last}@apollo.com",
  "carlyle": "{first}.{last}@carlyle.com",
  "the carlyle group": "{first}.{last}@carlyle.com",
  "bain capital": "{first}.{last}@baincapital.com",
  "warburg pincus": "{first}.{last}@warburgpincus.com",
  "tpg": "{first}.{last}@tpg.com",
  "advent international": "{first}.{last}@adventinternational.com",
  "general atlantic": "{first}.{last}@generalatlantic.com",
  "silver lake": "{first}.{last}@silverlake.com",
  "vista equity partners": "{first}.{last}@vistaequitypartners.com",
  "thoma bravo": "{first}.{last}@thomabravo.com",
  "hellman & friedman": "{first}.{last}@hfrco.com",
  "citadel": "{first}.{last}@citadel.com",
  "point72": "{first}.{last}@point72.com",
  "bridgewater": "{first}.{last}@bwater.com",
  "bridgewater associates": "{first}.{last}@bwater.com",
  "two sigma": "{first}.{last}@twosigma.com",
  "de shaw": "{first}.{last}@deshaw.com",
  "d.e. shaw": "{first}.{last}@deshaw.com",
  "millennium": "{first}.{last}@mlp.com",
  "millennium management": "{first}.{last}@mlp.com",
  "ares management": "{first}.{last}@aresmgmt.com",
  "blackrock": "{first}.{last}@blackrock.com",
  "vanguard": "{first}.{last}@vanguard.com",
  "fidelity": "{first}.{last}@fidelity.com",
  "fidelity investments": "{first}.{last}@fidelity.com",
  "pimco": "{first}.{last}@pimco.com",
  "t. rowe price": "{first}.{last}@troweprice.com",
  "state street": "{first}.{last}@statestreet.com",
  "lazard": "{first}.{last}@lazard.com",
  "evercore": "{first}.{last}@evercore.com",
  "centerview": "{first}.{last}@centerviewpartners.com",
  "centerview partners": "{first}.{last}@centerviewpartners.com",
  "moelis": "{first}.{last}@moelis.com",
  "moelis & company": "{first}.{last}@moelis.com",
  "perella weinberg": "{first}.{last}@pwpartners.com",
  "perella weinberg partners": "{first}.{last}@pwpartners.com",
  "pjt partners": "{first}.{last}@pjtpartners.com",
  "guggenheim": "{first}.{last}@guggenheimpartners.com",
  "guggenheim partners": "{first}.{last}@guggenheimpartners.com",
  "houlihan lokey": "{first}.{last}@hl.com",
  "jefferies": "{first}.{last}@jefferies.com",
  "raymond james": "{first}.{last}@raymondjames.com",
  "william blair": "{first}.{last}@williamblair.com",
  "robert w. baird": "{first}.{last}@rwbaird.com",
  "baird": "{first}.{last}@rwbaird.com",
  "stifel": "{first}.{last}@stifel.com",
  "cowen": "{first}.{last}@cowen.com",
  "td cowen": "{first}.{last}@cowen.com",
  "nomura": "{first}.{last}@nomura.com",
  "rbc": "{first}.{last}@rbccm.com",
  "rbc capital markets": "{first}.{last}@rbccm.com",
  "bmo": "{first}.{last}@bmo.com",
  "bmo capital markets": "{first}.{last}@bmo.com",
  "cibc": "{first}.{last}@cibc.com",
  "scotiabank": "{first}.{last}@scotiabank.com",
  "mckinsey": "{first}_{last}@mckinsey.com",
  "mckinsey & company": "{first}_{last}@mckinsey.com",
  "boston consulting group": "{first}.{last}@bcg.com",
  "bcg": "{first}.{last}@bcg.com",
  "bain & company": "{first}.{last}@bain.com",
  "bain": "{first}.{last}@bain.com",
  "deloitte": "{first}.{last}@deloitte.com",
  "pwc": "{first}.{last}@pwc.com",
  "pricewaterhousecoopers": "{first}.{last}@pwc.com",
  "ernst & young": "{first}.{last}@ey.com",
  "ey": "{first}.{last}@ey.com",
  "kpmg": "{first}.{last}@kpmg.com",
  "accenture": "{first}.{last}@accenture.com",
  "oliver wyman": "{first}.{last}@oliverwyman.com",
  "l.e.k.": "{first}.{last}@lek.com",
  "lek consulting": "{first}.{last}@lek.com",
  "a.t. kearney": "{first}.{last}@kearney.com",
  "kearney": "{first}.{last}@kearney.com",
  "sequoia": "{first}@sequoiacap.com",
  "sequoia capital": "{first}@sequoiacap.com",
  "andreessen horowitz": "{first}@a16z.com",
  "a16z": "{first}@a16z.com",
  "benchmark": "{first}@benchmark.com",
  "bessemer venture partners": "{first}@bvp.com",
  "greylock": "{first}@greylock.com",
  "insight partners": "{first}.{last}@insightpartners.com",
  "tiger global": "{first}.{last}@tigerglobal.com",
};

function generateEmail(firstName: string, lastName: string, company: string): string | null {
  if (!firstName || !lastName || !company) return null;
  const key = company.toLowerCase().trim();
  
  // Try exact match first
  let format = FIRM_EMAIL_FORMATS[key];
  
  // Try partial match
  if (!format) {
    for (const [firm, fmt] of Object.entries(FIRM_EMAIL_FORMATS)) {
      if (key.includes(firm) || firm.includes(key)) {
        format = fmt;
        break;
      }
    }
  }
  
  if (!format) return null;
  
  return format
    .replace("{first}", firstName.toLowerCase().replace(/[^a-z]/g, ""))
    .replace("{last}", lastName.toLowerCase().replace(/[^a-z]/g, ""));
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "no key" }, { status: 500 });

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { /* empty */ }

  const apolloId = typeof body.id === "string" ? body.id : "";
  if (!apolloId) return NextResponse.json({ error: "no id" }, { status: 400 });

  try {
    const res = await fetch(APOLLO_MATCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ id: apolloId, reveal_personal_emails: false }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return NextResponse.json({ error: "apollo " + res.status, detail: t.slice(0, 300) }, { status: res.status });
    }

    const data = await res.json();
    const p = data.person || data;

    const firstName = p.first_name || "";
    const lastName = p.last_name || "";
    const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Unknown";
    const company = p.organization?.name || "";

    // Use Apollo email if available, otherwise generate from format
    const apolloEmail = p.email || null;
    const generatedEmail = generateEmail(firstName, lastName, company);
    const email = apolloEmail || generatedEmail;

    return NextResponse.json({
      id: p.id || apolloId,
      name: fullName,
      title: p.title || "",
      company,
      email,
      emailGenerated: !apolloEmail && !!generatedEmail,
      linkedinUrl: p.linkedin_url || null,
      location: [p.city, p.state].filter(Boolean).join(", ") || p.country || "",
      school: p.education?.[0]?.school_name || p.education?.[0]?.school || "",
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
