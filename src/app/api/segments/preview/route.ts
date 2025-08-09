import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const PreviewSchema = z.object({
  workspaceId: z.string(),
  rules: z.array(
    z.object({ field: z.string(), op: z.string(), value: z.any() })
  ),
  limit: z.number().min(1).max(500).default(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = PreviewSchema.parse(await req.json());

    const whereParts: string[] = ["u.\"workspaceId\" = $1"];
    const params: any[] = [body.workspaceId];
    let i = 2;
    for (const r of body.rules) {
      if (r.field === "plan") {
        whereParts.push(`a.plan = $${i}`);
        params.push(r.value);
        i++;
      } else if (r.field === "feature_x_used_last7") {
        whereParts.push(`(
          SELECT COUNT(1) FROM "events" e
          WHERE e."productUserId" = u.id AND e.name = 'feature_x_used' AND e.ts >= now() - interval '7 days'
        ) >= $${i}`);
        params.push(Number(r.value));
        i++;
      }
    }

    const sql = `
      SELECT u.id, u.email, u.name, a.name AS account_name, a.plan
      FROM "users" u
      LEFT JOIN "accounts" a ON a.id = u."accountId"
      WHERE ${whereParts.join(" AND ")}
      LIMIT ${body.limit}
    `;

    const rows = await prisma.$queryRawUnsafe<any[]>(sql, ...params);
    return NextResponse.json({ rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}


