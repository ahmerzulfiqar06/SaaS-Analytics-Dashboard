import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This endpoint can be called by Vercel Cron or node-cron.
export async function POST(_req: NextRequest) {
  const reports = await prisma.report.findMany();
  // Naive: execute all; in production, filter by cron schedule
  for (const r of reports) {
    await fetch(`${process.env.NEXTAUTH_URL}/api/reports/send`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reportId: r.id }),
    });
  }
  return NextResponse.json({ ok: true, count: reports.length });
}


