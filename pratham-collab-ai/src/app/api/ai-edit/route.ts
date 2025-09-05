import { NextRequest, NextResponse } from "next/server";
import { editSelection } from "../../../../lib/ai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { selection, instruction } = await req.json();
  const result = await editSelection(selection ?? "", instruction ?? "Improve clarity");
  return NextResponse.json(result);
}
