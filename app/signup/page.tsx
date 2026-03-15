"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";

export default function SignupPage() {
  const router = useRouter();
  const signUp = useMutation((api as any).auth?.signUp);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      const result = await signUp({
        fullName,
        email,
        password,
      });

      const userId =
        (result && (result.userId ?? result.id ?? result)) ?? undefined;

      if (typeof window !== "undefined" && userId) {
        const id = String(userId);
        window.localStorage.setItem("kynect_user_id", id);
        document.cookie = `kynect_user_id=${encodeURIComponent(
          id,
        )}; path=/; max-age=${60 * 60 * 24 * 30}`;
      }

      router.push("/onboarding");
    } catch (err) {
      console.error("Sign up failed", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f8f7] px-4 py-10 text-black">
      <div className="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 font-['Instrument_Serif'] text-2xl tracking-[-0.5px]">
            Kynect<em>.</em>
          </div>
          <h1 className="font-['Instrument_Serif'] text-[28px] leading-tight tracking-[-1px]">
            Create your <em>account</em>
          </h1>
          <p className="mt-2 text-sm text-[#6b6860]">
            Start sourcing contacts and writing outreach in minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold">Full name</label>
            <input
              className="h-11 w-full rounded-[10px] border border-[#e4e2de] px-3.5 text-[14px] outline-none transition focus:border-black focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)]"
              placeholder="Alex Chen"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold">Email</label>
            <input
              type="email"
              className="h-11 w-full rounded-[10px] border border-[#e4e2de] px-3.5 text-[14px] outline-none transition focus:border-black focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)]"
              placeholder="you@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold">Password</label>
            <input
              type="password"
              className="h-11 w-full rounded-[10px] border border-[#e4e2de] px-3.5 text-[14px] outline-none transition focus:border-black focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold">
              Confirm password
            </label>
            <input
              type="password"
              className="h-11 w-full rounded-[10px] border border-[#e4e2de] px-3.5 text-[14px] outline-none transition focus:border-black focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {error && (
            <p className="text-sm text-[#dc2626]" aria-live="polite">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex h-11 w-full items-center justify-center rounded-[10px] bg-black text-[14px] font-semibold text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-[#6b6860]">
          Already have an account?{" "}
          <a
            href="/signin"
            className="font-semibold text-black underline-offset-2 hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

