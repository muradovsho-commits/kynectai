import { NextRequest, NextResponse } from "next/server";

const APOLLO_URL = "https://api.apollo.io/api/v1/mixed_people/api_search";

export type SearchContact = {
  id: string;
  name: string;
  title: string;
  company: string;
  linkedinUrl: string | null;
  linkedinSearchUrl: string;
  email: string | null;
  location: string;
  school: string;
};

const FIRM_EMAIL_DOMAINS: Record<string, string> = {
  "goldman sachs": "gs.com",
  "jp morgan": "jpmorgan.com",
  "jpmorgan": "jpmorgan.com",
  "jpmorgan chase": "jpmorgan.com",
  "morgan stanley": "morganstanley.com",
  "bank of america": "bofa.com",
  "bofa securities": "bofa.com",
  "citigroup": "citi.com",
  "citi": "citi.com",
  "barclays": "barclays.com",
  "ubs": "ubs.com",
  "deutsche bank": "db.com",
  "credit suisse": "credit-suisse.com",
  "hsbc": "hsbc.com",
  "wells fargo": "wellsfargo.com",
  "blackstone": "blackstone.com",
  "kkr": "kkr.com",
  "apollo global management": "apollo.com",
  "apollo global": "apollo.com",
  "carlyle": "carlyle.com",
  "the carlyle group": "carlyle.com",
  "bain capital": "baincapital.com",
  "warburg pincus": "warburgpincus.com",
  "tpg": "tpg.com",
  "general atlantic": "generalatlantic.com",
  "silver lake": "silverlake.com",
  "vista equity partners": "vistaequitypartners.com",
  "thoma bravo": "thomabravo.com",
  "citadel": "citadel.com",
  "point72": "point72.com",
  "bridgewater": "bwater.com",
  "bridgewater associates": "bwater.com",
  "two sigma": "twosigma.com",
  "de shaw": "deshaw.com",
  "d.e. shaw": "deshaw.com",
  "millennium": "mlp.com",
  "millennium management": "mlp.com",
  "blackrock": "blackrock.com",
  "vanguard": "vanguard.com",
  "fidelity": "fidelity.com",
  "fidelity investments": "fidelity.com",
  "pimco": "pimco.com",
  "t. rowe price": "troweprice.com",
  "state street": "statestreet.com",
  "lazard": "lazard.com",
  "evercore": "evercore.com",
  "centerview partners": "centerviewpartners.com",
  "centerview": "centerviewpartners.com",
  "moelis": "moelis.com",
  "moelis & company": "moelis.com",
  "perella weinberg": "pwpartners.com",
  "perella weinberg partners": "pwpartners.com",
  "pjt partners": "pjtpartners.com",
  "guggenheim": "guggenheimpartners.com",
  "guggenheim partners": "guggenheimpartners.com",
  "houlihan lokey": "hl.com",
  "jefferies": "jefferies.com",
  "raymond james": "raymondjames.com",
  "william blair": "williamblair.com",
  "baird": "rwbaird.com",
  "robert w. baird": "rwbaird.com",
  "stifel": "stifel.com",
  "nomura": "nomura.com",
  "rbc": "rbccm.com",
  "rbc capital markets": "rbccm.com",
  "bmo": "bmo.com",
  "bmo capital markets": "bmo.com",
  "mckinsey": "mckinsey.com",
  "mckinsey & company": "mckinsey.com",
  "boston consulting group": "bcg.com",
  "bcg": "bcg.com",
  "bain & company": "bain.com",
  "bain": "bain.com",
  "deloitte": "deloitte.com",
  "pwc": "pwc.com",
  "pricewaterhousecoopers": "pwc.com",
  "ernst & young": "ey.com",
  "ey": "ey.com",
  "kpmg": "kpmg.com",
  "accenture": "accenture.com",
  "oliver wyman": "oliverwyman.com",
  "lek consulting": "lek.com",
  "kearney": "kearney.com",
  "a.t. kearney": "kearney.com",
  "sequoia capital": "sequoiacap.com",
  "sequoia": "sequoiacap.com",
  "andreessen horowitz": "a16z.com",
  "a16z": "a16z.com",
  "insight partners": "insightpartners.com",
  "tiger global": "tigerglobal.com",
  "ares management": "aresmgmt.com",
  "cowen": "cowen.com",
  "td cowen": "cowen.com",
  "cibc": "cibc.com",
  "scotiabank": "scotiabank.com",
  "greenhill": "greenhill.com",
  "qatalyst": "qatalyst.com",
  "rothschild": "rothschildandco.com",
  "rothschild & co": "rothschildandco.com",
  "macquarie": "macquarie.com",
  "societe generale": "sgcib.com",
  "bnp paribas": "bnpparibas.com",
  "keybanc": "key.com",
  "keybanc capital markets": "key.com",
};

const VERTICAL_TO_TITLES: Record<string, string[]> = {
  "investment banking": ["investment banking analyst", "investment banking associate", "investment banker"],
  "private equity": ["private equity analyst", "private equity associate"],
  "venture capital": ["venture capital analyst", "venture capital associate", "principal"],
  "hedge fund": ["hedge fund analyst", "portfolio manager", "trader"],
  "asset management": ["asset management analyst", "portfolio analyst", "fund analyst"],
  "equity research": ["equity research analyst", "research analyst", "research associate"],
  "sales & trading": ["trader", "sales trader", "trading analyst"],
  "wealth management": ["wealth management analyst", "financial advisor", "wealth advisor"],
  "corporate finance": ["corporate finance analyst", "fp&a analyst", "finance analyst"],
  "consulting": ["consultant", "management consultant", "strategy consultant"],
  "real estate": ["real estate analyst", "acquisitions analyst", "real estate associate"],
  "credit": ["credit analyst", "credit associate", "leveraged finance analyst"],
  "restructuring": ["restructuring analyst", "restructuring associate"],
  "fintech": ["software engineer", "product manager", "data scientist"],
  "risk management": ["risk analyst", "risk manager", "market risk analyst"],
  "compliance": ["compliance analyst", "compliance officer", "regulatory analyst"],
};

type ApolloPerson = {
  id?: string;
  first_name?: string;
  last_name_obfuscated?: string;
  title?: string;
  organization?: { name?: string };
  [key: string]: unknown;
};

function titleCase(str: string): string {
  return str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

function getEmailHint(firstName: string, company: string): string | null {
  if (!firstName || !company) return null;
  const key = company.toLowerCase().trim();
  let domain: string | undefined;
  domain = FIRM_EMAIL_DOMAINS[key];
  if (!domain) {
    for (const [firm, d] of Object.entries(FIRM_EMAIL_DOMAINS)) {
      if (key.includes(firm) || firm.includes(key)) { domain = d; break; }
    }
  }
  if (!domain) return null;
  const clean = firstName.toLowerCase().replace(/[^a-z]/g, "");
  return clean + ".[lastname]@" + domain;
}

function getLinkedInSearchUrl(firstName: string, _lastInitial: string, company: string, title: string): string {
  const parts = [firstName, company, title].filter(Boolean);
  const q = encodeURIComponent(parts.join(" "));
  return "https://www.linkedin.com/search/results/people/?keywords=" + q;
}

function mapPerson(p: ApolloPerson, index: number): SearchContact {
  const firstName = p.first_name || "";
  const lastName = p.last_name_obfuscated || "";
  const name = [firstName, lastName].filter(Boolean).join(" ") || "Unknown";
  const company = p.organization?.name || "";
  const title = p.title || "";

  const emailHint = getEmailHint(firstName, company);
  const linkedinSearchUrl = getLinkedInSearchUrl(firstName, lastName, company, title);

  return {
    id: p.id || `apollo-${index}`,
    name: titleCase(name),
    title,
    company,
    linkedinUrl: null,
    linkedinSearchUrl,
    email: emailHint,
    location: "",
    school: "",
  };
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) return NextResponse.json({ contacts: [], debug: "no key" });

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { /* empty */ }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  const filters = (body.filters && typeof body.filters === "object") ? body.filters as Record<string, string[]> : {};
  const firms = Array.isArray(filters.firm) ? filters.firm.filter(Boolean) : [];
  const roles = Array.isArray(filters.role) ? filters.role.filter(Boolean) : [];
  const groups = Array.isArray(filters.group) ? filters.group.filter(Boolean) : [];
  const locations = Array.isArray(filters.location) ? filters.location.filter(Boolean) : [];

  const titleTerms: string[] = [];
  for (const r of roles) {
    const key = r.toLowerCase();
    if (VERTICAL_TO_TITLES[key]) titleTerms.push(...VERTICAL_TO_TITLES[key]);
    else titleTerms.push(r);
  }
  for (const g of groups) {
    const key = g.toLowerCase();
    if (VERTICAL_TO_TITLES[key]) titleTerms.push(...VERTICAL_TO_TITLES[key]);
  }

  const payload: Record<string, unknown> = { per_page: 100, page: 1 };
  if (query) payload.q_keywords = query;
  if (firms.length) payload.q_organization_name = firms.join(" OR ");
  if (titleTerms.length) payload.person_titles = [...new Set(titleTerms)];
  if (locations.length) payload.person_locations = locations;
  if (!query && !firms.length && !titleTerms.length && !locations.length) {
    payload.q_keywords = "financial services";
  }

  let res: Response;
  try {
    res = await fetch(APOLLO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return NextResponse.json({ contacts: [], debug: "fetch failed: " + String(err) });
  }

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    return NextResponse.json({ contacts: [], debug: "apollo " + res.status + ": " + t.slice(0, 300) });
  }

  let data: Record<string, unknown>;
  try { data = await res.json(); } catch {
    return NextResponse.json({ contacts: [], debug: "json parse failed" });
  }

  const people = Array.isArray(data.people) ? data.people : [];
  const contacts: SearchContact[] = people.map((p: ApolloPerson, i: number) => mapPerson(p, i));

  return NextResponse.json({ contacts, total: data.total_entries ?? contacts.length });
}
