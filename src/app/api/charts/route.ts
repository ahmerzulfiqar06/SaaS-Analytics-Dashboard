import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateSchema = z.object({
  workspaceId: z.string(),
  name: z.string(),
  query: z.any(),
  viz: z.string(),
});

export async function POST(req: NextRequest) {
  const body = CreateSchema.parse(await req.json());
  const chart = await prisma.chart.create({ data: body });
  return NextResponse.json(chart);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId")!;
  const charts = await prisma.chart.findMany({ where: { workspaceId } });
  return NextResponse.json(charts);
}


