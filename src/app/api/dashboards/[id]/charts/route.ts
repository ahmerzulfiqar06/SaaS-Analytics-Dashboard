import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const Body = z.object({ chartId: z.string(), position: z.number().int().default(0) });

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = Body.parse(await req.json());
    // Avoid duplicate entries using unique(dashboardId, chartId)
    const existing = await prisma.dashboardChart.findFirst({ where: { dashboardId: params.id, chartId: body.chartId } });
    if (existing) return NextResponse.json(existing);
    const item = await prisma.dashboardChart.create({
      data: { dashboardId: params.id, chartId: body.chartId, position: body.position },
    });
    return NextResponse.json(item);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = (await req.json()) as { items: { id: string; position: number }[] };
    await Promise.all(
      (body.items || []).map((it) =>
        prisma.dashboardChart.update({ where: { id: it.id }, data: { position: it.position } }),
      ),
    );
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}


