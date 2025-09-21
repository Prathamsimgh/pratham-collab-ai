"use client";
import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/core";
import { Bot, User2, SendHorizonal, Wand2, Sparkles, Search } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string; editorUpdate?: { apply: () => void; preview: string; format: "text" | "html" } };

export default function ChatSidebar({ editor }: { editor: Editor | null }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! Ask me to improve text, summarize the doc, or run a web search (Agent)." }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function sendText(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;

    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");

    try {
      const editorHTML = editor?.getHTML?.() ?? "";
      const from = editor?.state?.selection?.from;
      const to = editor?.state?.selection?.to;
      const selection = editor?.state?.doc && typeof from === "number" && typeof to === "number"
        ? editor.state.doc.textBetween(from, to, "\n")
        : "";

      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, editorHTML, selection })
      }).then(r => r.json());

      if (res?.type === "editor_update" && res.editorUpdate) {
        const { target, operation, format, content, applyImmediately } = res.editorUpdate as any;
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
        setMessages(m => [...m, { role: "assistant", content: "I prepared an edit. Preview and confirm to apply.", editorUpdate: { apply, preview: res.editorUpdate.content, format: res.editorUpdate.format } }]);
        if (applyImmediately) apply();
      } else {
        setMessages(m => [...m, { role: "assistant", content: res?.message ?? "" }]);
      }
    } catch {
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
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Agent failed. Please try again." }]);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto px-3 py-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <div className={
              m.role === "user"
                ? "inline-flex items-start gap-2 rounded-2xl px-3 py-2 text-sm bg-accent-50 text-accent-900 border border-accent-100 shadow-sm"
                : "inline-flex items-start gap-2 rounded-2xl px-3 py-2 text-sm bg-brand-50 text-brand-900 border border-brand-100 shadow-sm"
            }>
              <div className={"mt-0.5 shrink-0 rounded-full p-1 " + (m.role === "user" ? "bg-accent-100" : "bg-brand-100")}>
                {m.role === "user" ? <User2 className="w-3.5 h-3.5 text-accent-700" /> : <Bot className="w-3.5 h-3.5 text-brand-700" />}
              </div>
              <div>
                <div>{m.content}</div>
                {m.editorUpdate?.preview && (
                  <div className="mt-2">
                    <div className="text-xs text-brand-700 mb-1">AI suggestion preview</div>
                    <div className="border border-brand-200 rounded bg-white p-2 text-left max-h-40 overflow-auto whitespace-pre-wrap">
                      {m.editorUpdate.format === "html"
                        ? <div dangerouslySetInnerHTML={{ __html: m.editorUpdate.preview }} />
                        : m.editorUpdate.preview}
                    </div>
                    <button className="mt-2 text-xs px-2 py-1 border border-brand-200 rounded bg-white hover:bg-brand-50 text-brand-700"
                      onClick={() => m.editorUpdate?.apply()}>
                      Confirm and Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-brand-100 space-y-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-2 shadow-sm">
            <Wand2 className="w-4 h-4 text-brand-600" />
            <input
              className="flex-1 bg-transparent text-sm focus:outline-none"
              placeholder="Ask or say: fix my selection"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendText()}
            />
          </div>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
            onClick={() => sendText()}
            aria-label="Send"
            title="Send"
          >
            <SendHorizonal className="w-4 h-4" />
            Send
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="text-xs px-2 py-1 rounded-full border border-brand-200 hover:bg-brand-50 text-brand-700"
            onClick={() => sendText("Improve the selected text for clarity and tone.")}
          >
            <Sparkles className="w-3.5 h-3.5 inline -mt-0.5 mr-1" /> Improve writing
          </button>
          <button className="text-xs px-2 py-1 rounded-full border border-brand-200 hover:bg-brand-50 text-brand-700"
            onClick={() => sendText("Summarize the current document in 3 bullet points.")}
          >
            <Wand2 className="w-3.5 h-3.5 inline -mt-0.5 mr-1" /> Summarize
          </button>
          <button className="text-xs px-2 py-1 rounded-full border border-brand-200 hover:bg-brand-50 text-brand-700"
            onClick={() => sendText("Create a concise outline for the current document.")}
          >
            <Wand2 className="w-3.5 h-3.5 inline -mt-0.5 mr-1" /> Outline
          </button>
          <button className="text-xs px-2 py-1 rounded-full border border-brand-200 hover:bg-brand-50 text-brand-700"
            onClick={() => runAgent("Research the topic mentioned in my selection and provide a brief summary with sources.")}
          >
            <Search className="w-3.5 h-3.5 inline -mt-0.5 mr-1" /> Agent: topic research
          </button>
        </div>
      </div>
    </div>
  );
}
