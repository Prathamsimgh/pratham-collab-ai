"use client";
import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/core";

type Msg = { role: "user" | "assistant"; content: string; editorUpdate?: any };

export default function ChatSidebar({ editor }: { editor: Editor | null }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! Ask me to improve text, summarize the doc, or run a web search (Agent)." }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send() {
    try {
      const editorHTML = editor?.getHTML?.() ?? "";
      const from = editor?.state?.selection?.from;
      const to = editor?.state?.selection?.to;
      const selection = editor?.state?.doc && typeof from === "number" && typeof to === "number"
        ? editor.state.doc.textBetween(from, to, "\n")
        : "";

      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, editorHTML, selection })
      }).then(r => r.json());

      if (res?.type === "editor_update" && res.editorUpdate) {
        const { target, operation, format, content, applyImmediately } = res.editorUpdate;
        const apply = () => {
          if (!editor) return;
          if (target === "document") {
            if (operation === "replace") editor.chain().setContent(format === "html" ? content : "<p>" + content + "</p>").run();
            if (operation === "append") editor.commands.insertContent(format === "html" ? content : "<p>" + content + "</p>");
            if (operation === "prepend") editor.chain().setContent((format === "html" ? content : "<p>" + content + "</p>") + editor.getHTML()).run();
          } else {
            const fromSel = editor.state?.selection?.from;
            const toSel = editor.state?.selection?.to;
            if (typeof fromSel === "number" && typeof toSel === "number") {
              editor.commands.insertContentAt({ from: fromSel, to: toSel }, format === "html" ? content : content);
            }
          }
        };
        setMessages(m => [...m, { role: "assistant", content: "I prepared an edit. Preview and confirm to apply.", editorUpdate: { apply, preview: content, format } }]);
        if (applyImmediately) apply();
      } else {
        setMessages(m => [...m, { role: "assistant", content: res?.message ?? "" }]);
      }
      setInput("");
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", content: "Chat failed. Please try again." }]);
    }
  }

  async function runAgent(q: string) {
    try {
      const res = await fetch("/api/agent/search", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q })
      }).then(r => r.json());

      setMessages(m => [...m, { role: "assistant", content: "Agent summary:\n" + (res?.summary ?? "") }]);
      if (editor && res?.summary) editor.commands.insertContent("<blockquote>" + res.summary + "</blockquote>");
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", content: "Agent failed. Please try again." }]);
    }
  }

  return (
  <div className="h-full flex flex-col">
  <div className="flex-1 overflow-auto p-3 space-y-3">
  {messages.map((m, i) => (
  <div key={i} className={m.role === "user" ? "text-right" : ""}>
  <div className={m.role === "user"
  ? "inline-block rounded-lg px-3 py-2 text-sm bg-accent-50 text-accent-900 border border-accent-100"
  : "inline-block rounded-lg px-3 py-2 text-sm bg-brand-50 text-brand-900 border border-brand-100"}>
  {m.content}
  {m.editorUpdate?.preview && (
  <div className="mt-2">
  <div className="text-xs text-brand-700 mb-1">AI suggestion preview</div>
  <div className="border border-brand-200 rounded bg-white p-2 text-left max-h-40 overflow-auto whitespace-pre-wrap">
  {m.editorUpdate.format === "html"
  ? <div dangerouslySetInnerHTML={{ __html: m.editorUpdate.preview }} />
  : m.editorUpdate.preview}
  </div>
  <button className="mt-2 text-xs px-2 py-1 border border-brand-200 rounded bg-white hover:bg-brand-50 text-brand-700"
  onClick={() => m.editorUpdate.apply()}>
  Confirm and Apply
  </button>
  </div>
  )}
  </div>
  </div>
  ))}
  <div ref={bottomRef} />
  </div>
  <div className="p-3 border-t border-brand-100 bg-white/60 backdrop-blur space-y-2">
  <div className="flex gap-2">
  <input className="flex-1 border border-brand-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400" placeholder="Ask or say: fix my selection"
  value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
  <button className="px-3 py-2 text-sm rounded bg-brand-600 hover:bg-brand-700 text-white shadow-sm" onClick={send}>Send</button>
  </div>
  <div className="flex gap-2">
  <button className="text-xs px-2 py-1 border border-brand-200 rounded text-brand-700 hover:bg-brand-50" onClick={() => runAgent("Latest news on Next.js 15, summarize key changes.")}> 
  Agent: Next.js 15 news → insert
  </button>
  </div>
  </div>
  </div>
  );
}
