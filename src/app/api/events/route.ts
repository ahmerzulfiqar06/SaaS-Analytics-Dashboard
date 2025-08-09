import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { publishWorkspaceEvent } from "@/lib/realtime";

const EventSchema = z.object({
  workspaceId: z.string().min(1),
  accountId: z.string().optional(),
  userId: z.string().optional(),
  name: z.string().min(1),
  ts: z.coerce.date(),
  props: z.record(z.any()).default({}),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const body = EventSchema.parse(json);

    const created = await prisma.event.create({
      data: {
        workspaceId: body.workspaceId,
        accountId: body.accountId ?? null,
        productUserId: body.userId ?? null,
        name: body.name,
        ts: body.ts,
        props: body.props as any,
      },
    });

    publishWorkspaceEvent(body.workspaceId, { type: "event.ingested", eventId: created.id, name: body.name });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}


