import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateSchema = z.object({ workspaceId: z.string(), name: z.string() });

export async function POST(req: NextRequest) {
  const body = CreateSchema.parse(await req.json());
  const dash = await prisma.dashboard.create({ data: body });
  return NextResponse.json(dash);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const dash = await prisma.dashboard.findUnique({ where: { id }, include: { items: true } });
    return NextResponse.json(dash);
  }
  const workspaceId = searchParams.get("workspaceId")!;
  const dashboards = await prisma.dashboard.findMany({ where: { workspaceId }, include: { items: true } });
  return NextResponse.json(dashboards);
}


