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

    // Keep the shell behind the iframe on the same theme as the landing, so a
    // dark visitor never sees a white frame around a dark page. The landing owns
    // the choice; this only mirrors it. Same origin, so the key is shared.
    const applyTheme = (t?: string | null) => {
      // Light unless this visitor explicitly chose dark, same rule the landing uses.
      const theme = t === 'dark' ? 'dark' : 'light';
      if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
      else document.documentElement.removeAttribute('data-theme');
      document.documentElement.style.background = theme === 'dark' ? '#111110' : '#fafafa';
    };
    try { applyTheme(localStorage.getItem('offerbell-theme')); } catch {}

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'theme') {
        applyTheme(e.data.theme);
        return;
      }
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
