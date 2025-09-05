import { NextRequest, NextResponse } from "next/server";
import { chatToJSON } from "../../../../lib/ai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages, editorHTML, selection } = body as {
    messages: { role: "user" | "assistant"; content: string }[];
    editorHTML?: string;
    selection?: string;
  };
  const extra = `You may use the provided editorHTML and selection for context. If the user asks to edit the whole document, target="document".`;
  const parsed = await chatToJSON(
    [
      { role: "user", content: "Editor HTML (may be partial):\n" + (editorHTML ?? "") },
      { role: "user", content: "Current selection (may be empty):\n" + (selection ?? "") },
      ...messages,
    ],
    { extraSystem: extra }
  );
  return NextResponse.json(parsed);
}
