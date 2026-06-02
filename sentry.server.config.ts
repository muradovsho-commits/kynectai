// Server-side (Node.js runtime) Sentry init. Loaded by instrumentation.ts.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Attaches request headers + IP to events. Useful for debugging which
  // user hit an error. Flip to false if you want zero PII in Sentry.
  sendDefaultPii: true,

  // 100% of traces in dev, 10% in prod. At ~20 users this is plenty and
  // keeps you well inside the Sentry free tier. Set to 0 to disable tracing
  // entirely (errors are still captured).
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});
