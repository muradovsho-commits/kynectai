"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("offerbell_user_id");
    if (userId) {
      router.replace("/dashboard");
    } else {
      setShowLanding(true);
    }

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'navigate' && e.data?.url) {
        router.push(e.data.url);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  if (!showLanding) return null;

  return (
    <iframe
      src="/offerbell-landing.html"
      style={{ width: "100vw", height: "100vh", border: "none" }}
    />
  );
}
