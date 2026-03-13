"use client";

import { useState } from "react";

type RecruitingStage =
  | "just_exploring"
  | "recruiting_6_12"
  | "recruiting_now"
  | "already_in_process";

export default function OnboardingPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [stage, setStage] = useState<RecruitingStage>("just_exploring");
  const [targets, setTargets] = useState<string[]>([]);

  const handleToggleTarget = (value: string) => {
    setTargets((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      fullName,
      email,
      school,
      gradYear,
      stage,
      targets,
    };

    try {
      window.localStorage.setItem("kynect_onboarding", JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }

    window.location.href = "/contact-finder";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f8f7] px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white px-6 py-7 shadow-[0_18px_55px_rgba(15,23,42,0.14)] sm:px-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold tracking-tight">
              Kynect<span className="italic">.</span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              A few questions to personalize your workspace.
            </p>
          </div>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-medium text-zinc-600">
            Step 1 of 1
          </span>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="First and last name"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-0 transition focus:border-zinc-900"
              />
            </div>
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
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                School
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. NYU Stern"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                Grad year
              </label>
              <input
                type="text"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                placeholder="2026"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
              Where are you in recruiting?
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setStage("just_exploring")}
                className={`rounded-lg border px-3 py-2 text-left text-xs ${
                  stage === "just_exploring"
                    ? "border-zinc-900 bg-zinc-900 text-zinc-50"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                }`}
              >
                <div className="font-semibold">Just exploring</div>
                <div className="mt-0.5 text-[11px] text-zinc-400">
                  Learning more before sending outreach.
                </div>
              </button>
              <button
                type="button"
                onClick={() => setStage("recruiting_6_12")}
                className={`rounded-lg border px-3 py-2 text-left text-xs ${
                  stage === "recruiting_6_12"
                    ? "border-zinc-900 bg-zinc-900 text-zinc-50"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                }`}
              >
                <div className="font-semibold">Recruiting in 6–12 months</div>
                <div className="mt-0.5 text-[11px] text-zinc-400">
                  Want to warm up alumni and build pipeline.
                </div>
              </button>
              <button
                type="button"
                onClick={() => setStage("recruiting_now")}
                className={`rounded-lg border px-3 py-2 text-left text-xs ${
                  stage === "recruiting_now"
                    ? "border-zinc-900 bg-zinc-900 text-zinc-50"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                }`}
              >
                <div className="font-semibold">Recruiting now / this season</div>
                <div className="mt-0.5 text-[11px] text-zinc-400">
                  Actively sending messages and scheduling chats.
                </div>
              </button>
              <button
                type="button"
                onClick={() => setStage("already_in_process")}
                className={`rounded-lg border px-3 py-2 text-left text-xs ${
                  stage === "already_in_process"
                    ? "border-zinc-900 bg-zinc-900 text-zinc-50"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                }`}
              >
                <div className="font-semibold">Already in process</div>
                <div className="mt-0.5 text-[11px] text-zinc-400">
                  Have interviews but still networking on the side.
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
              What are you targeting?
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                "Investment Banking",
                "Private Equity",
                "Hedge Fund",
                "Growth Equity",
                "Consulting",
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleToggleTarget(label)}
                  className={`rounded-full border px-3 py-1 ${
                    targets.includes(label)
                      ? "border-zinc-900 bg-zinc-900 text-zinc-50"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-400">
            <span>We use this to personalize searches and outreach suggestions.</span>
            <span>Under 30 seconds.</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <a
              href="/signin"
              className="text-xs font-medium text-zinc-500 underline-offset-4 hover:text-zinc-800 hover:underline"
            >
              Already have an account? Sign in
            </a>
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-5 py-2 text-xs font-semibold text-zinc-50 shadow-sm hover:bg-zinc-800"
            >
              Continue to Contact Finder
              <span aria-hidden>→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

