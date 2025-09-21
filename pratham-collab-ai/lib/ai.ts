import { z } from "zod";

export type ChatTurn = { role: "user" | "assistant" | "system"; content: string };

export const EditorUpdateSchema = z.object({
  type: z.enum(["assistant", "editor_update"]),
  message: z.string().optional(),
  editorUpdate: z.object({
    target: z.enum(["selection", "document"]),
    operation: z.enum(["replace", "append", "prepend", "insert_after"]),
    format: z.enum(["text", "html"]).default("text"),
    content: z.string(),
    applyImmediately: z.boolean().default(false)
  }).optional()
});
export type EditorUpdate = z.infer<typeof EditorUpdateSchema>;

const OPENAI = process.env.OPENAI_API_KEY;
const OPENROUTER = process.env.OPENROUTER_API_KEY;
const SITE =
  (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, "")) ||
  process.env.VERCEL_URL ||
  "localhost:3000";

function sysPrompt(extra?: string) {
  return [
    {
      role: "system",
      content:
        `You are a careful writing assistant integrated into a collaborative editor.
Return STRICT JSON only (no markdown fence). Use this schema:
{
 "type": "assistant" | "editor_update",
 "message": string (optional),
 "editorUpdate": {
   "target": "selection" | "document",
   "operation": "replace" | "append" | "prepend" | "insert_after",
   "format": "text" | "html",
   "content": string,
   "applyImmediately": boolean
 }
}
- For normal chat, set type="assistant" and include "message".
- For edits, set type="editor_update" and fill editorUpdate.
- When asked to fix grammar or rewrite, preserve meaning and formatting.
- Keep responses short.`
        + (extra ? "\n" + extra : "")
    } as ChatTurn,
  ];
}

async function callOpenAI(messages: ChatTurn[], model = "gpt-4o-mini") {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + OPENAI },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callOpenRouter(messages: ChatTurn[], model = "openrouter/auto") {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENROUTER,
      "HTTP-Referer": "https://" + SITE,
      "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "Pratham Collab Editor"
    },
    body: JSON.stringify({ model, temperature: 0.2, messages }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function chatToJSON(userTurns: ChatTurn[], options?: { extraSystem?: string }) {
  const messages = [...sysPrompt(options?.extraSystem), ...userTurns];
  let raw: string;
  try {
    if (OPENAI) {
      raw = await callOpenAI(messages);
    } else if (OPENROUTER) {
      raw = await callOpenRouter(messages);
    } else {
      raw = JSON.stringify({ type: "assistant", message: "Demo mode: no API key configured." });
    }
  } catch {
    raw = JSON.stringify({ type: "assistant", message: "AI service unavailable. Running in offline demo mode." });
  }

  let parsed: EditorUpdate;
  try { parsed = EditorUpdateSchema.parse(JSON.parse(raw)); }
  catch {
    // Last resort: treat raw text as normal chat
    parsed = { type: "assistant", message: raw };
  }
  return parsed;
}

export async function editSelection(selection: string, instruction: string) {
  const extra = `You will receive ONLY the user's selected text and an edit instruction.
Return STRICT JSON (no markdown fence) and prefer type="editor_update" targeting "selection".`;
  return chatToJSON(
    [
      { role: "user", content: "Instruction: " + instruction },
      { role: "user", content: "Selected text:\n" + selection },
    ],
    { extraSystem: extra }
  );
}
