"use client";
import { useEffect, useMemo, useState, Suspense, Component } from "react";
import dynamic from "next/dynamic";
import ChatSidebar from "../../components/ChatSidebar";

// Simple Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-600">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

// Force Editor to load only on client to avoid SSR/Turbopack oddities
const Editor = dynamic(() => import("../../components/Editor"), { 
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading editor...</div>
});

function seededRandomColor(seed) {
  const colors = ["#FF6B6B", "#4ECDC4", "#5567FF", "#FFA62B", "#6A4C93"];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function Page() {
  const [preview, setPreview] = useState<{open: boolean, original: string, suggestion: string, format: "text" | "html", apply: () => void}>({
    open: false, original: "", suggestion: "", format: "text", apply: () => {}
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const roomId = useMemo(() => {
    if (typeof window === "undefined") return "demo";
    const url = new URL(window.location.href);
    return url.searchParams.get("room") || "demo";
  }, []);

  const user = useMemo(() => ({
    name: "Pratham",
    color: seededRandomColor("Pratham") // Stable color based on name
  }), []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-4 grid grid-cols-3 gap-4 min-h-[80vh]">
        <div className="col-span-2">
          <div className="p-4 text-center">Loading editor...</div>
        </div>
        <div className="col-span-1">
          <ChatSidebar editor={null} />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <h1
          className="text-2xl md:text-3xl font-semibold gradient-text"
          style={{ WebkitBackgroundClip: "text" }}
        >
          Live Collaborative AI Editor
        </h1>
        <p className="mt-2 text-neutral-700">
          Realtime editing with AI assistance and a search agent. Inspired by the reference design.
        </p>
        <div className="mt-4 flex gap-3">
          <a
            href="#editor"
            className="btn-primary"
          >
            Start editing
          </a>
          <a className="btn-ghost" href="https://liveeditor.vly.site/" target="_blank" rel="noreferrer">
            Reference
          </a>
        </div>
      </section>

      {/* Main workspace */}
      <section id="editor" className="mx-auto max-w-6xl px-4 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[70vh]">
        <div className="lg:col-span-2 space-y-3">
          <div className="window">
            <div className="window-header">
              <span className="window-dot bg-danger-600" />
              <span className="window-dot bg-warning-600" />
              <span className="window-dot bg-success-600" />
              <span className="ml-2 text-xs text-neutral-500">Document</span>
            </div>
            <div className="p-3">
              <ErrorBoundary>
                <Suspense fallback={<div className="p-4 text-center">Loading editor...</div>}>
                  <Editor
                    roomId={roomId}
                    user={user}
                    onPreview={({ original, suggestion, format, apply }) => setPreview({ open: true, original, suggestion, format, apply })}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="window h-full">
            <div className="window-header">
              <span className="window-dot bg-danger-600" />
              <span className="window-dot bg-warning-600" />
              <span className="window-dot bg-success-600" />
              <span className="ml-2 text-xs text-neutral-500">Chat</span>
            </div>
            <ChatSidebar editor={null} />
          </div>
        </div>

        {/* Responsive preview modal */}
        {preview.open && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl max-w-[90vw] md:max-w-[800px] ring-1 ring-brand-100">
              <div className="px-4 py-3 border-b border-brand-100 font-medium bg-brand-50/60">Preview: Original vs AI Suggestion</div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-auto">
                <div>
                  <div className="text-xs text-brand-700 mb-1">Original</div>
                  <div className="border border-brand-200 rounded p-3 whitespace-pre-wrap bg-white">{preview.original}</div>
                </div>
                <div>
                  <div className="text-xs text-brand-700 mb-1">AI Suggestion</div>
                  <div className="border border-brand-200 rounded p-3 bg-white">
                    {preview.format === "html"
                      ? <div dangerouslySetInnerHTML={{ __html: preview.suggestion }} />
                      : <pre className="whitespace-pre-wrap">{preview.suggestion}</pre>}
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-brand-100 flex justify-end gap-2">
                <button className="px-3 py-1 border border-brand-200 rounded text-brand-700 hover:bg-brand-50" onClick={() => setPreview(p => ({ ...p, open: false }))}>Cancel</button>
                <button className="px-3 py-1 rounded bg-brand-600 hover:bg-brand-700 text-white" onClick={() => { preview.apply(); setPreview(p => ({ ...p, open: false })); }}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
