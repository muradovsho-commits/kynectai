import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withSentryConfig(nextConfig, {
  // Org + project slugs are read from Vercel env vars so nothing Sentry-specific
  // lives in the repo and you never have to edit code to configure it. These are
  // ONLY used for source-map upload, which itself only runs when SENTRY_AUTH_TOKEN
  // is set. If any are unset, the build still succeeds and just skips upload.
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only log source-map upload chatter in CI, keep local/Vercel output quiet.
  silent: !process.env.CI,

  // Source-map upload is OPTIONAL and only happens if SENTRY_AUTH_TOKEN is set
  // in Vercel env. If it is unset, the build still succeeds and skips upload -
  // you just get minified stack traces until you add the token. Safe default.
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
