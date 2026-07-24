// ============================================================================
// ADMIN ANNOUNCEMENTS API
// ----------------------------------------------------------------------------
// No password and no env var. Authorization is the isAdmin flag on the caller's
// users row, checked inside Convex on every call. This route forwards the
// caller's identity (x-ob-user + x-ob-session headers) and lets Convex decide;
// it deliberately does NOT pass serverSecret, which would make Convex trust the
// userId the browser sent.
//
// The route exists because the email blast needs a server (RESEND_API_KEY).
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { Resend } from "resend";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const EMAIL_CHUNK = 100; // Resend batch endpoint takes up to 100 messages.

function caller(req: NextRequest): { userId: string; sessionToken?: string } {
  return {
    userId: req.headers.get("x-ob-user") || "",
    sessionToken: req.headers.get("x-ob-session") || undefined,
  };
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailHtml(title: string, body: string, link: string, linkLabel: string): string {
  const paragraphs = esc(body)
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#374151">${p.replace(/\n/g, "<br />")}</p>`)
    .join("");
  const cta = link
    ? `<a href="${esc(link)}" style="display:inline-block;padding:12px 24px;background:#0a0a0a;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold;margin-top:6px">${esc(linkLabel || "Open OfferBell")}</a>`
    : "";
  return `
    <div style="font-family: sans-serif; color: #111; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="font-family: serif; font-size: 24px; margin: 0 0 16px;">${esc(title)}</h2>
      ${paragraphs}
      ${cta}
      <p style="margin-top: 26px; font-size: 12px; color: #9ca3af;">You are receiving this because you have an OfferBell account.</p>
    </div>
  `;
}

// Convex throws "Not authorized." for a non-admin caller. Surface that as a 401
// rather than a 500 so the page can render its not-found state.
function fail(err: any) {
  const msg = err?.message || "Request failed";
  const denied = /not authorized/i.test(msg);
  return NextResponse.json({ error: denied ? "Not authorized." : msg }, { status: denied ? 401 : 500 });
}

// GET: list past announcements plus audience sizes for the composer.
export async function GET(req: NextRequest) {
  const who = caller(req);
  if (!who.userId) return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  try {
    const [items, counts] = await Promise.all([
      convex.query((api as any).announcements.adminList, who),
      convex.query((api as any).announcements.adminAudienceCounts, who),
    ]);
    return NextResponse.json({ items, counts });
  } catch (err: any) {
    console.error("Admin announcements list error:", err);
    return fail(err);
  }
}

// POST: create an announcement, optionally emailing it to the same audience.
export async function POST(req: NextRequest) {
  const who = caller(req);
  if (!who.userId) return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  try {
    const raw = await req.json();
    const title = (raw?.title || "").toString().trim();
    const body = (raw?.body || "").toString().trim();
    const audience = (raw?.audience || "all").toString();
    const link = (raw?.link || "").toString().trim();
    const linkLabel = (raw?.linkLabel || "").toString().trim();
    const sendEmail = raw?.sendEmail === true;

    if (!title || !body) {
      return NextResponse.json({ error: "Title and body are required." }, { status: 400 });
    }

    const created: any = await convex.mutation((api as any).announcements.adminCreate, {
      ...who,
      title,
      body,
      audience,
      link: link || undefined,
      linkLabel: linkLabel || undefined,
    });

    let emailed = 0;
    let emailError = "";

    if (sendEmail) {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        emailError = "RESEND_API_KEY is not set, so the in-app announcement was posted without email.";
      } else {
        const recipients: any[] = await convex.query(
          (api as any).announcements.adminRecipients,
          { ...who, audience },
        );
        const resend = new Resend(apiKey);
        const html = emailHtml(title, body, link, linkLabel);
        for (let i = 0; i < recipients.length; i += EMAIL_CHUNK) {
          const chunk = recipients.slice(i, i + EMAIL_CHUNK);
          try {
            const result: any = await resend.batch.send(
              chunk.map((r) => ({
                from: "OfferBell <onboarding@offerbell.org>",
                to: r.email,
                subject: title,
                html,
              })),
            );
            if (result?.error) {
              emailError = result.error?.message || "Resend rejected a batch.";
            } else {
              emailed += chunk.length;
            }
          } catch (e: any) {
            emailError = e?.message || "Email send failed.";
          }
        }
        if (emailed > 0) {
          try {
            await convex.mutation((api as any).announcements.adminRecordEmail, {
              ...who,
              id: created.id,
              count: emailed,
            });
          } catch {}
        }
      }
    }

    return NextResponse.json({ ok: true, id: created?.id, emailed, emailError });
  } catch (err: any) {
    console.error("Admin announcement create error:", err);
    return fail(err);
  }
}

// PATCH: show or hide an existing announcement.
export async function PATCH(req: NextRequest) {
  const who = caller(req);
  if (!who.userId) return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  try {
    const raw = await req.json();
    const id = (raw?.id || "").toString();
    const active = raw?.active === true;
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
    await convex.mutation((api as any).announcements.adminSetActive, { ...who, id, active });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Admin announcement patch error:", err);
    return fail(err);
  }
}
