"use client";
import { useEffect, useMemo, useState, Suspense, Component } from "react";
import dynamic from "next/dynamic";
import ChatSidebar from "../../components/ChatSidebar";

// Enhanced Error Boundary with better error handling
class ErrorBoundary extends Component<
  {children: React.ReactNode, fallback?: React.ReactNode},
  {hasError: boolean, error?: Error}
> {
  constructor(props: {children: React.ReactNode, fallback?: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
              <p className="text-gray-600 text-sm mb-4">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary text-sm px-4 py-2"
              >
                🔄 Refresh Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-gray-100 p-3 rounded text-xs">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap text-red-700">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Enhanced Loading Component
const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-accent-500 rounded-full animate-spin mx-auto animation-delay-150"></div>
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

// Force Editor to load only on client to avoid SSR/Turbopack oddities
const Editor = dynamic(() => import("../../components/Editor"), {
  ssr: false,
  loading: () => <LoadingSpinner message="Loading collaborative editor..." />
});

function seededRandomColor(seed: string) {
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
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200">
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-brand-700">Loading Pratham Collab AI</span>
            </div>
            <p className="text-gray-500">Preparing your collaborative workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-gradient-to-r from-brand-50 to-accent-50 px-4 py-2 text-sm text-brand-700 shadow-sm backdrop-blur-sm">
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
            <span>✨ Enhanced UI Experience</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text leading-tight">
              Live Collaborative
              <br />
              <span className="text-brand-600">AI Editor</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience seamless real-time collaboration with AI-powered editing,
              intelligent suggestions, and a beautiful glass-morphism interface.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a
              href="#editor"
              className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🚀 Start Creating
            </a>
            <a
              className="btn-ghost text-lg px-8 py-4 hover:bg-brand-50 transition-all duration-200"
              href="https://liveeditor.vly.site/"
              target="_blank"
              rel="noreferrer"
            >
              📖 View Demo
            </a>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
            <div className="card p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-800">Real-time Collaboration</h3>
              <p className="text-sm text-gray-600">Edit together with instant synchronization</p>
            </div>
            <div className="card p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto">
                <span className="text-white text-xl">🤖</span>
              </div>
              <h3 className="font-semibold text-gray-800">AI-Powered</h3>
              <p className="text-sm text-gray-600">Smart suggestions and content generation</p>
            </div>
            <div className="card p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto">
                <span className="text-white text-xl">🎨</span>
              </div>
              <h3 className="font-semibold text-gray-800">Beautiful UI</h3>
              <p className="text-sm text-gray-600">Modern glass-morphism design</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main workspace */}
      <section id="editor" className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[75vh]">
          {/* Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="window group hover:shadow-lg transition-all duration-300">
              <div className="window-header">
                <div className="flex items-center gap-2">
                  <span className="window-dot bg-danger-600 group-hover:bg-danger-500 transition-colors" />
                  <span className="window-dot bg-warning-600 group-hover:bg-warning-500 transition-colors" />
                  <span className="window-dot bg-success-600 group-hover:bg-success-500 transition-colors" />
                  <span className="ml-3 text-sm font-medium text-gray-700">Collaborative Document</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ErrorBoundary>
                  <Suspense fallback={
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-4">
                        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-500">Loading collaborative editor...</p>
                      </div>
                    </div>
                  }>
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

          {/* Chat Section */}
          <div className="lg:col-span-1">
            <div className="window h-full group hover:shadow-lg transition-all duration-300">
              <div className="window-header">
                <div className="flex items-center gap-2">
                  <span className="window-dot bg-danger-600 group-hover:bg-danger-500 transition-colors" />
                  <span className="window-dot bg-warning-600 group-hover:bg-warning-500 transition-colors" />
                  <span className="window-dot bg-success-600 group-hover:bg-success-500 transition-colors" />
                  <span className="ml-3 text-sm font-medium text-gray-700">AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
              <div className="h-[calc(100%-4rem)]">
                <ChatSidebar editor={null} />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced preview modal */}
        {preview.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="card max-w-[95vw] md:max-w-[900px] max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="px-6 py-4 border-b border-brand-100 font-semibold text-gray-800 bg-gradient-to-r from-brand-50 to-accent-50 flex items-center justify-between">
                <span>🤖 AI Suggestion Preview</span>
                <button
                  onClick={() => setPreview(p => ({ ...p, open: false }))}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/50 transition-colors"
                >
                  <span className="text-gray-500 text-lg">×</span>
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[60vh] overflow-auto">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Original Content</span>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[200px] overflow-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{preview.original}</pre>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-brand-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-brand-700">AI Suggestion</span>
                  </div>
                  <div className="border border-brand-200 rounded-lg p-4 bg-white min-h-[200px] overflow-auto shadow-sm">
                    {preview.format === "html"
                      ? <div dangerouslySetInnerHTML={{ __html: preview.suggestion }} className="prose prose-sm max-w-none" />
                      : <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{preview.suggestion}</pre>}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-brand-100 flex justify-end gap-3 bg-white/70 backdrop-blur">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setPreview(p => ({ ...p, open: false }))}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => { preview.apply(); setPreview(p => ({ ...p, open: false })); }}
                >
                  ✨ Apply Suggestion
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
