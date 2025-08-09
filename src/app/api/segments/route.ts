import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const Create = z.object({ workspaceId: z.string(), name: z.string(), rules: z.any() });

export async function POST(req: NextRequest) {
  const body = Create.parse(await req.json());
  const seg = await prisma.segment.create({ data: body });
  return NextResponse.json(seg);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId")!;
  const segs = await prisma.segment.findMany({ where: { workspaceId } });
  return NextResponse.json(segs);
}


