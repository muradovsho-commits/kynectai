// Client-side Sentry init. Runs in the browser before the app becomes
// interactive. (This file replaces the older sentry.client.config.ts pattern.)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  sendDefaultPii: true,

  // 100% of traces in dev, 10% in prod. No Session Replay in v1 to keep the
  // client bundle lean and avoid recording user sessions before launch.
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});

// Instruments client-side router navigations for tracing.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
