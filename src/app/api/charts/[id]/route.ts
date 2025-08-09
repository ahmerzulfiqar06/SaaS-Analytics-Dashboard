import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const chart = await prisma.chart.findUnique({ where: { id } });
  if (!chart) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(chart);
}


