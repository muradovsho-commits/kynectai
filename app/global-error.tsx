"use client";

// Catches React render errors anywhere in the App Router tree and reports
// them to Sentry. This is the last-resort boundary; route-level error.tsx
// files (if present) handle errors closer to where they occur.
import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        {/* NextError is Next.js's default error page. App Router doesn't
        expose a status code here, so we pass 0 for a generic message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
