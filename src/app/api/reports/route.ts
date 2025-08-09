import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const Create = z.object({ workspaceId: z.string(), name: z.string(), dashboardId: z.string(), cron: z.string(), recipients: z.array(z.string()) });

export async function POST(req: NextRequest) {
  const body = Create.parse(await req.json());
  const report = await prisma.report.create({ data: body });
  return NextResponse.json(report);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get('workspaceId')!;
  const reports = await prisma.report.findMany({ where: { workspaceId } });
  return NextResponse.json(reports);
}


