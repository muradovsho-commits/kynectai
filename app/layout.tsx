import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./convex-client-provider";
import { ProgressSyncProvider } from "./progress-sync-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OfferBell - Land Your Dream Finance Offer",
  description: "The all-in-one platform for college students breaking into finance. Contact finder, AI coach, interview prep, and outreach tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=Sora:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('offerbell-theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');document.documentElement.style.background='#111110';document.documentElement.style.colorScheme='dark';}var c=localStorage.getItem('offerbell_sidebar_collapsed');document.documentElement.style.setProperty('--sidebar-w',c==='true'?'60px':'240px');}catch(e){}document.addEventListener('copy',function(e){e.preventDefault();});document.addEventListener('cut',function(e){e.preventDefault();});document.addEventListener('contextmenu',function(e){e.preventDefault();});document.addEventListener('selectstart',function(e){if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.isContentEditable))return;e.preventDefault();});})();`,
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: `body{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}input,textarea,[contenteditable="true"]{-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text;}` }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider><ProgressSyncProvider>{children}</ProgressSyncProvider></ConvexClientProvider>
      </body>
    </html>
  );
}
