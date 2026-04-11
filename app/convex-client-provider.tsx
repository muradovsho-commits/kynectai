"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        background: "#fafaf9",
        color: "#0c0c0c",
      }}>
        <div style={{ maxWidth: 420, lineHeight: 1.6 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Convex not configured</h1>
          <p style={{ fontSize: 14, marginBottom: 16 }}>To run this app locally:</p>
          <ol style={{ fontSize: 14, paddingLeft: 20, marginBottom: 16 }}>
            <li>Copy <code style={{ background: "#eee", padding: "2px 6px", borderRadius: 4 }}>.env.example</code> to <code style={{ background: "#eee", padding: "2px 6px", borderRadius: 4 }}>.env.local</code></li>
            <li>Run <code style={{ background: "#eee", padding: "2px 6px", borderRadius: 4 }}>npx convex dev</code> (creates or links a Convex project)</li>
            <li>Paste the Convex URL into <code style={{ background: "#eee", padding: "2px 6px", borderRadius: 4 }}>NEXT_PUBLIC_CONVEX_URL</code> in <code style={{ background: "#eee", padding: "2px 6px", borderRadius: 4 }}>.env.local</code></li>
            <li>Restart the dev server</li>
          </ol>
          <p style={{ fontSize: 13, color: "#636160" }}>Optional: add <code style={{ background: "#eee", padding: "2px 6px", borderRadius: 4 }}>APOLLO_API_KEY</code> for contact search.</p>
        </div>
      </div>
    );
  }
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

