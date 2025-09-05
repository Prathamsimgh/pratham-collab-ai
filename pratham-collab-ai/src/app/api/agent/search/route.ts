import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const TAVILY = process.env.TAVILY_API_KEY;

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  if (!TAVILY) {
    return NextResponse.json({ summary: "Agent demo: Add TAVILY_API_KEY for live search.", links: [] });
  }
  const search = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + TAVILY },
    body: JSON.stringify({ query, max_results: 5, search_depth: "basic", include_answer: true }),
  });
  const data = await search.json();
  const answer = data?.answer ?? "No answer.";
  const links = (data?.results ?? []).map((r: any) => ({ title: r.title, url: r.url }));
  return NextResponse.json({ summary: answer, links });
}
