import { NextRequest, NextResponse } from "next/server";
import { QuerySchema, runQuery } from "@/lib/query";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const input = QuerySchema.parse(json);
    const result = await runQuery(input);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}


