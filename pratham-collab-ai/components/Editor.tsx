"use client";
import { useEffect, useMemo, useState, ElementType } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Check, X, Wand2, Sparkles, AlignJustify, PartyPopper, MoveRight } from "lucide-react";

type Props = {
  roomId: string;
  user: { name: string; color: string };
  onPreview: (args: { original: string; suggestion: string; format: "text" | "html"; apply: () => void }) => void;
};

export default function Editor({ roomId, user, onPreview }: Props) {
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [wsError, setWsError] = useState(false);
  const ydoc = useMemo(() => new Y.Doc(), [roomId]);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_COLLAB_WS_URL || process.env.COLLAB_WS_URL || "wss://demos.yjs.dev";
    const p = new WebsocketProvider(wsUrl, "room-" + roomId, ydoc);

    p.on("status", (event: { status: string }) => {
      if (event.status === "disconnected") {
        setWsError(true);
      } else if (event.status === "connected") {
        setWsError(false);
      }
    });

    setProvider(p);
    return () => p.destroy();
  }, [roomId, ydoc]);

  const editor = useEditor({
    editable: true,
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({}),
      Placeholder.configure({ placeholder: "Start typing… Select text to use AI tools." }),
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
      // Disable Collaboration extension if WebSocket error to prevent crash
      ...(wsError ? [] : [Collaboration.configure({ document: ydoc })]),
      ...(provider && !wsError ? [CollaborationCursor.configure({
        provider: provider as any,
        user
      })] : [])
    ],
    content: "<p>Welcome! Select some text and try the floating AI toolbar.</p>",
  }, [provider, wsError]);

  async function runAI(instruction: string) {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const original = editor.state.doc.textBetween(from, to, "\n");
    if (!original) return;

    const res = await fetch("/api/ai-edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selection: original, instruction })
    }).then(r => r.json());

    const suggestion: string = res?.editorUpdate?.content ?? "";
    const format: "text" | "html" = res?.editorUpdate?.format ?? "text";

    const apply = () => {
      if (!editor) return;
      editor.chain().focus().insertContentAt({ from, to }, format === "html" ? suggestion : escapeHtml(suggestion)).run();
    };

    onPreview({ original, suggestion, format, apply });
  }

  function escapeHtml(s: string) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  if (wsError) {
    return <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Warning: Collaboration server connection failed. Editor is in read-only mode.</div>;
  }

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-white/70 backdrop-blur px-2 py-2 shadow-sm sticky top-0 z-10">
        <Btn label="Fix grammar" icon={Wand2} onClick={() => runAI("Fix grammar and clarity, keep meaning.")} />
        <Btn label="Shorten" icon={MoveRight} onClick={() => runAI("Shorten aggressively but keep key info.")} />
        <Btn label="Expand" icon={Sparkles} onClick={() => runAI("Expand with one concise, helpful paragraph.")} />
        <Btn label="Formal" icon={AlignJustify} onClick={() => runAI("Rewrite in a professional, formal tone.")} />
        <Btn label="Casual" icon={PartyPopper} onClick={() => runAI("Rewrite in a friendly, casual tone.")} />
        <Btn label="Convert to table" icon={AlignJustify} onClick={() => runAI("Convert to an HTML table. Return HTML with <table> only.")} />
      </div>
      <div className="prose max-w-none bg-white border rounded-xl p-5 min-h-[60vh] shadow-sm mt-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Btn({ label, icon: Icon, onClick }: { label: string; icon: ElementType<{ className?: string }>; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-xs px-3 py-1.5 rounded-lg border border-brand-200 hover:bg-brand-50 transition-colors inline-flex items-center gap-1.5 text-brand-900">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}