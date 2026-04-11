"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useMutation } from "convex/react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const verifyEmail = useMutation((api as any).auth?.verifyEmail);
  const router = useRouter();
  const hasAttempted = useRef(false);
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("No verification token found.");
      return;
    }

    if (hasAttempted.current) return;
    hasAttempted.current = true;

    verifyEmail({ token })
      .then(() => {
        setStatus("success");
      })
      .catch((err: any) => {
        setStatus("error");
        const msg = err?.data ? String(err.data) : (err?.message || "Something went wrong verifying your email.");
        setErrorMsg(msg.replace("Uncaught Error: ", ""));
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f7" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: 40, background: "#fff", borderRadius: 12, border: "1px solid #e4e2de", textAlign: "center" }}>
        
        {status === "loading" && (
          <div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, marginBottom: 12 }}>Verifying your email...</h2>
            <p style={{ color: "#6b6860", fontSize: 14 }}>Please wait a moment.</p>
          </div>
        )}
        
        {status === "success" && (
          <div>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, marginBottom: 12 }}>Email Verified!</h2>
            <p style={{ color: "#6b6860", fontSize: 14, marginBottom: 24 }}>Your account has been successfully verified.</p>
            <button
              onClick={() => router.push("/signin")}
              style={{
                width: "100%", height: 48, borderRadius: 10, border: "none",
                background: "#0a0a0a", color: "#ffffff", fontSize: 14, fontWeight: 700,
                fontFamily: "'Sora', sans-serif", cursor: "pointer"
              }}
            >
              Go to Sign In
            </button>
          </div>
        )}

        {status === "error" && (
          <div>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fef2f2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, marginBottom: 12 }}>Verification Failed</h2>
            <p style={{ color: "#ef4444", fontSize: 14, marginBottom: 24 }}>{errorMsg}</p>
            <button
              onClick={() => router.push("/signup")}
              style={{
                width: "100%", height: 48, borderRadius: 10, border: "max(1px, 0.1em) solid #e4e2de",
                background: "#fff", color: "#0a0a0a", fontSize: 14, fontWeight: 700,
                fontFamily: "'Sora', sans-serif", cursor: "pointer"
              }}
            >
              Back to Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f7" }}>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
