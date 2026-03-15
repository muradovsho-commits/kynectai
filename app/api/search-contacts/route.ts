import { NextRequest, NextResponse } from "next/server";

const APOLLO_URL = "https://api.apollo.io/api/v1/mixed_people/search";
const DEFAULT_LOCATIONS = ["New York, NY", "San Francisco, CA", "Chicago, IL", "Boston, MA", "Los Angeles, CA"];

type ApiContact = {
  id?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  last_name_obfuscated?: string;
  title?: string;
  organization_name?: string;
  organization?: { name?: string };
  linkedin_url?: string | null;
  email?: string | null;
  city?: string;
  state?: string;
  [key: string]: unknown;
};

export type SearchContact = {
  id: string;
  name: string;
  title: string;
  company: string;
  linkedinUrl: string | null;
  email: string | null;
  location: string;
};

function mapPersonToContact(person: ApiContact, index: number): SearchContact {
  const name = person.name ??
    ([person.first_name, (person.last_name_obfuscated ?? person.last_name)].filter(Boolean).join(" ") || "Unknown");
  const company =
    person.organization_name ??
    person.organization?.name ??
    "";
  const locParts = [person.city, person.state].filter(Boolean);
  const location = locParts.length ? locParts.join(", ") : "";
  const email =
    person.email && String(person.email).trim() !== ""
      ? String(person.email).trim()
      : null;
  return {
    id: person.id ?? `person-${index}`,
    name,
    title: person.title ?? "",
    company,
    linkedinUrl: person.linkedin_url ?? null,
    email,
    location,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const query = typeof body.query === "string" ? body.query.trim() : "";
    const filters = body.filters && typeof body.filters === "object" ? body.filters : {};
    const roleArr = Array.isArray(filters.role) ? filters.role.map((r) => (typeof r === "string" ? r.trim() : "")).filter(Boolean) : [];
    const firmArr = Array.isArray(filters.firm) ? filters.firm.map((f) => (typeof f === "string" ? f.trim() : "")).filter(Boolean) : [];
    const locationArr = Array.isArray(filters.location) ? filters.location.map((loc) => (typeof loc === "string" ? loc.trim() : "")).filter(Boolean) : [];

    const apiKey = process.env.APOLLO_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ contacts: [] });
    }

    const payload: Record<string, unknown> = {
      api_key: apiKey,
      q_keywords: query || undefined,
      person_titles: roleArr.length ? roleArr : undefined,
      organization_names: firmArr.length ? firmArr : undefined,
      person_locations: locationArr.length ? locationArr : DEFAULT_LOCATIONS,
      page: 1,
      per_page: 25,
    };
    const cleaned = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined)
    );

    const res = await fetch(APOLLO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(cleaned),
    });

    if (!res.ok) {
      return NextResponse.json({ contacts: [] });
    }

    const data = (await res.json().catch(() => ({}))) as {
      people?: ApiContact[];
      [key: string]: unknown;
    };
    const people = Array.isArray(data.people) ? data.people : [];
    const contacts: SearchContact[] = people.map((p, i) => mapPersonToContact(p, i));

    return NextResponse.json({ contacts });
  } catch {
    return NextResponse.json({ contacts: [] });
  }
}
