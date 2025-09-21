import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Pratham Collab AI - Live Collaborative Editor",
  description: "Experience seamless real-time collaboration with AI-powered editing, intelligent suggestions, and a beautiful glass-morphism interface.",
  keywords: "collaborative editor, AI writing, real-time collaboration, TipTap, Next.js",
  authors: [{ name: "Pratham" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#F26D21",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-800 antialiased">
        <div className="app-bg" />
        <header className="sticky top-0 z-20 backdrop-blur border-b border-brand-100/80 bg-white/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-500" />
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-600" />
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-300" />
              <span className="ml-2 sm:ml-3 font-semibold gradient-text text-sm sm:text-base">Pratham Collab AI</span>
            </div>
            <nav className="flex items-center gap-1 sm:gap-2">
              <a className="btn-ghost text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5" href="https://vercel.com" target="_blank" rel="noreferrer">Deploy</a>
              <a className="btn-primary text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5" href="https://github.com" target="_blank" rel="noreferrer">Star</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </main>
        <footer className="border-t border-brand-100/80 bg-white/60 backdrop-blur mt-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            <span>Made with ❤️ for creative collaboration</span>
            <span className="text-gray-400">v1.0 • Built with Next.js & TipTap</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
