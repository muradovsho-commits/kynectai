"use client";

import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/contact-finder";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f8f7] px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white px-6 py-7 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
        <header className="mb-5">
          <div className="text-sm font-semibold tracking-tight">
            Kynect<span className="italic">.</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Sign in with the email you used during onboarding.
          </p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-full bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-50 shadow-sm hover:bg-zinc-800"
          >
            Continue
          </button>
          <p className="mt-1 text-[11px] text-zinc-400">
            No password yet — we&apos;ll add magic links and proper auth later.
          </p>
        </form>
      </div>
    </div>
  );
}

