import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { seedDatabase } from "@/lib/seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { ok: false, error: "Missing DATABASE_URL in environment" },
        { status: 500 },
      );
    }
    const prisma = new PrismaClient();
    await seedDatabase(prisma);
    await prisma.$disconnect();
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error", stack: err?.stack ?? null },
      { status: 500 },
    );
  }
}


