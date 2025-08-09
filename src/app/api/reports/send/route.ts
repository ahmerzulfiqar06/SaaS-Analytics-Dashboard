import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import puppeteer from "puppeteer";
import { Resend } from "resend";
import { Buffer } from "buffer";

const Body = z.object({ reportId: z.string() });

export async function POST(req: NextRequest) {
  const { reportId } = Body.parse(await req.json());
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { dashboard: true },
  });
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const run = await prisma.reportRun.create({
    data: { reportId: report.id, status: "pending" },
  });

  try {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    const url = `${process.env.NEXTAUTH_URL}/dashboards/${report.dashboardId}?embed=1`;
    await page.goto(url, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4" });
    await browser.close();

    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: report.recipients,
      subject: `Report: ${report.name}`,
      html: `<p>Attached is your scheduled report.</p>`,
      attachments: [
        {
          filename: `report-${report.id}.pdf`,
          content: Buffer.from(pdf).toString("base64"),
        },
      ],
    });

    await prisma.reportRun.update({ where: { id: run.id }, data: { status: "success" } });
    return NextResponse.json({ ok: true, runId: run.id });
  } catch (e: any) {
    await prisma.reportRun.update({ where: { id: run.id }, data: { status: "failed", error: e.message } });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


