import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Collaborative AI Editor — Pratham Singh",
  description: "Live collab editor with AI edits and web search agent.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-brand-50 to-white text-neutral-900`}
        suppressHydrationWarning
      >
        {/* Ambient gradient background glows */}
        <div className="app-bg"></div>

        {/* Sticky translucent header */}
        <header className="sticky top-0 z-40 border-b border-white/60 bg-white/40 backdrop-blur supports-[backdrop-filter]:bg-white/30 shadow-sm">
          <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <a href="/" className="font-semibold gradient-text">
              Live Collaborative AI Editor
            </a>
            <nav className="flex items-center gap-2">
              <a
                className="btn-ghost text-sm"
                href="https://liveeditor.vly.site/"
                target="_blank"
                rel="noreferrer"
              >
                Reference
              </a>
              <a
                className="btn-ghost text-sm"
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-brand-100 mt-4 bg-brand-50/70">
          <div className="mx-auto max-w-6xl px-4 py-3 text-sm text-brand-900/80">
            Built by Pratham Singh · Demo only
          </div>
        </footer>
      </body>
    </html>
  );
}
