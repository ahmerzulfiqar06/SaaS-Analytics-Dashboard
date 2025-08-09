import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { seedDatabase } from "@/lib/seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(): Promise<Response> {
  try {
    const prisma = new PrismaClient();
    await seedDatabase(prisma);
    await prisma.$disconnect();
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}


