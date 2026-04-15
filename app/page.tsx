"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [showLanding, setShowLanding] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const userId = localStorage.getItem("offerbell_user_id");
    if (userId) {
      router.replace("/dashboard");
    } else {
      setShowLanding(true);
    }

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'navigate' && e.data?.url) {
        // Fade out the iframe wrapper before navigating
        const wrapper = document.getElementById('landing-wrapper');
        if (wrapper) {
          wrapper.style.opacity = '0';
          wrapper.style.transition = 'opacity 0.25s ease';
        }
        setTimeout(() => {
          router.push(e.data.url);
        }, 150);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  if (!showLanding) return null;

  return (
    <div id="landing-wrapper" style={{ opacity: 1, transition: 'opacity 0.3s ease' }}>
      <iframe
        ref={iframeRef}
        src="/offerbell-landing.html"
        style={{ width: "100vw", height: "100vh", border: "none" }}
      />
    </div>
  );
}
