"use client";

import Link from "next/link";
import { ReactNode } from "react";

// Shared chrome for legal pages: branded header, readable prose width, link
// back to home. Pages pass in `title`, `lastUpdated`, and their body content.
//
// Styling note: kept inline to match the rest of the app and to avoid any
// dependency on a CSS file that might get out of sync. The 720px max-width
// matches typical legal-doc readability (50-75 chars per line). All h2/h3
// styling comes from the page itself via the prose wrapper class below.
export default function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#fafaf9",
      fontFamily: "'Sora', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#18181b",
      lineHeight: 1.6,
      padding: "48px 24px 96px",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Back link */}
        <Link
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "#71717a", textDecoration: "none",
            fontSize: 13, fontWeight: 500,
            marginBottom: 32,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          OfferBell
        </Link>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Instrument Serif', 'Times New Roman', serif",
          fontSize: 52,
          letterSpacing: "-1.5px",
          fontWeight: 400,
          margin: "0 0 12px 0",
          lineHeight: 1.1,
        }}>
          {title}
        </h1>

        {/* Last updated */}
        <p style={{
          fontSize: 13,
          color: "#a1a1aa",
          margin: "0 0 40px 0",
        }}>
          Last updated: {lastUpdated}
        </p>

        {/* Body prose */}
        <div className="legal-prose" style={{
          fontSize: 15,
          color: "#27272a",
        }}>
          {children}
        </div>

        {/* Footer link strip */}
        <div style={{
          marginTop: 64,
          paddingTop: 24,
          borderTop: "1px solid #e4e4e7",
          fontSize: 13,
          color: "#71717a",
          display: "flex", gap: 20, flexWrap: "wrap",
        }}>
          <Link href="/privacy" style={{ color: "#71717a", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: "#71717a", textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/refund" style={{ color: "#71717a", textDecoration: "none" }}>Refund Policy</Link>
          <Link href="/cookies" style={{ color: "#71717a", textDecoration: "none" }}>Cookie Policy</Link>
        </div>
      </div>

      {/* Prose styling for all child h2, h3, p, ul */}
      <style jsx global>{`
        .legal-prose h2 {
          font-family: 'Sora', sans-serif;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.3px;
          color: #18181b;
          margin: 40px 0 12px;
        }
        .legal-prose h3 {
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #18181b;
          margin: 24px 0 8px;
        }
        .legal-prose p {
          margin: 0 0 14px;
        }
        .legal-prose ul {
          margin: 0 0 14px;
          padding-left: 22px;
        }
        .legal-prose li {
          margin: 0 0 6px;
        }
        .legal-prose strong {
          color: #18181b;
          font-weight: 600;
        }
        .legal-prose a {
          color: #18181b;
          text-decoration: underline;
          text-decoration-color: #d4d4d8;
          text-underline-offset: 3px;
        }
      `}</style>
    </div>
  );
}
