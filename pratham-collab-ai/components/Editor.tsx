"use client";

import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Awareness } from "y-protocols/awareness";

type Props = {
  roomId?: string; // tolerate undefined while URL params load
  user: { name: string; color: string };
  onPreview: (args: { original: string; suggestion: string; format: "text" | "html"; apply: () => void }) => void;
};

export default function Editor({ roomId, user, onPreview }: Props) {
  // Connection bundle
  const [conn, setConn] = useState<{
    doc: Y.Doc;
    awareness: Awareness;
    provider: WebsocketProvider;
  } | null>(null);

  // Create Doc + Awareness immediately; provider after we have a roomId
  const baseDoc = useMemo(() => new Y.Doc(), []); // single Doc instance per mount
  const baseAwareness = useMemo(() => new Awareness(baseDoc), [baseDoc]);

  useEffect(() => {
    // If no room yet, keep a local editor running (no provider)
    if (!roomId) {
      setConn(null);
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_COLLAB_WS_URL || "wss://demos.yjs.dev";
    const provider = new WebsocketProvider(wsUrl, `room-${roomId}`, baseDoc, { awareness: baseAwareness });

    // Optional: small log to confirm provider status
    provider.on("status", (e: any) => {
      // console.log("[y-websocket]", e.status);
    });

    setConn({ doc: baseDoc, awareness: baseAwareness, provider });

    return () => {
      try {
        provider.destroy();
      } catch {}
      // Note: don't destroy baseDoc/baseAwareness here—they're reused if roomId changes back.
    };
  }, [roomId, baseDoc, baseAwareness]);

  // Build extensions: start with safe local ones
  const safeBase = useMemo(
    () => [
      StarterKit.configure({ history: false }),
      Placeholder.configure({ placeholder: "Start typing… Select text to use AI tools." }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    []
  );

  // Collaboration only (no cursor) to avoid version mismatch/runtime errors
  const collab = useMemo(() => {
    return [Collaboration.configure({ document: baseDoc })] as any[];
  }, [baseDoc]);

  // If we have a connection, run collaborative; otherwise local-only
  const extensions = useMemo(() => (conn ? [...safeBase, ...collab] : safeBase), [conn, safeBase, collab]);

  const editor = useEditor(
    {
      editable: true,
      immediatelyRender: false,
      extensions,
      content: "<p>Welcome! Select some text and try the floating AI toolbar.</p>",
    },
    [extensions] // re-init when collab stack appears
  );

  // --- Utilities ---
  function escapeHtml(s: string) {
    return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  }

  async function runAI(instruction: string) {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const original = editor.state.doc.textBetween(from, to, "\n");
    if (!original) return;

    const res = await fetch("/api/ai-edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selection: original, instruction }),
    }).then((r) => r.json());

    const suggestion: string = res?.editorUpdate?.content ?? "";
    const format: "text" | "html" = res?.editorUpdate?.format ?? "text";

    const apply = () => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertContentAt({ from, to }, format === "html" ? suggestion : escapeHtml(suggestion))
        .run();
    };

    onPreview({ original, suggestion, format, apply });
  }

  return (
    <div className="h-full">
      {editor && (
        <div className="mb-3 toolbar">
          <div className="flex flex-wrap items-center gap-2">
          <Btn label="Fix grammar" onClick={() => runAI("Fix grammar and clarity, keep meaning.")} />
          <Btn label="Shorten" onClick={() => runAI("Shorten aggressively but keep key info.")} />
          <Btn label="Expand" onClick={() => runAI("Expand with one concise, helpful paragraph.")} />
          <Btn label="Formal" onClick={() => runAI("Rewrite in a professional, formal tone.")} />
          <Btn label="Casual" onClick={() => runAI("Rewrite in a friendly, casual tone.")} />
          <Btn label="Convert to table" onClick={() => runAI("Convert to an HTML table. Return HTML with <table> only.")} />
        </div>
        </div>
      )}
      <div className="prose max-w-none card p-4 min-h-[60vh]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Btn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-xs px-2.5 py-1.5 rounded-md border border-brand-200 text-brand-700 hover:bg-brand-50 transition">
      {label}
    </button>
  );
}