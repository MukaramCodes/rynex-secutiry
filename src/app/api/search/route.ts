import { NextResponse } from "next/server";
import { searchSite } from "@/lib/search-index";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const results = searchSite(q).slice(0, 12);
  return NextResponse.json({ results });
}
