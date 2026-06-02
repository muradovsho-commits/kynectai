// Next.js instrumentation entry point. Runs once per server instance and
// loads the right Sentry config for the active runtime. onRequestError
// captures errors thrown in Server Components, route handlers, and middleware.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
