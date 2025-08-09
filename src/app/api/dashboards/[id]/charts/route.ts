import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const Body = z.object({ chartId: z.string(), position: z.number().int().default(0) });

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = Body.parse(await req.json());
  const item = await prisma.dashboardChart.create({ data: { dashboardId: params.id, chartId: body.chartId, position: body.position } });
  return NextResponse.json(item);
}


