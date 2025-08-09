import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const QuerySchema = z.object({
  workspaceId: z.string(),
  metric: z.enum(["events.count", "users.dau", "adoption.rate"]),
  event: z.string().optional(),
  range: z.object({ from: z.coerce.date(), to: z.coerce.date() }),
  interval: z.enum(["day", "week"]).default("day"),
  groupBy: z.enum(["plan", "country"]).optional(),
  filters: z
    .array(
      z.object({
        field: z.string(),
        op: z.enum(["=", "!=", ">=", "<=", ">", "<", "contains"]),
        value: z.any(),
      }),
    )
    .optional(),
});

type QueryInput = z.infer<typeof QuerySchema>;

export type SeriesPoint = { t: string; value: number; group?: string | null };

export async function runQuery(input: QueryInput) {
  // Delegate to raw SQL for flexibility
  const { workspaceId, metric, event, range, interval, groupBy, filters } = input;

  const bin = interval === "day" ? "1 day" : "1 week";

  const whereParts: string[] = ["e.\"workspaceId\" = $1", "e.ts BETWEEN $2 AND $3"];
  const params: any[] = [workspaceId, range.from, range.to];
  let paramIndex = 4;

  if (event && metric === "events.count") {
    whereParts.push(`e.name = $4`);
    params.push(event);
    paramIndex = 5;
  }

  if (filters && filters.length) {
    for (const f of filters) {
      // Only JSONB props for now: props->>'field'
      if (f.field.startsWith("props.")) {
        const key = f.field.replace(/^props\./, "");
        const expr = `e.props ->> '${key}'`;
        const placeholder = `$${paramIndex++}`;
        params.push(String(f.value));
        switch (f.op) {
          case "=":
            whereParts.push(`${expr} = ${placeholder}`);
            break;
          case "!=":
            whereParts.push(`${expr} <> ${placeholder}`);
            break;
          case "contains":
            whereParts.push(`${expr} ILIKE '%' || ${placeholder} || '%'`);
            break;
          default:
            whereParts.push(`${expr} = ${placeholder}`);
        }
      }
    }
  }

  const whereClause = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";

  let groupSelect = "";
  let groupJoin = "";
  if (groupBy === "plan") {
    groupSelect = ", a.plan as group_value";
    groupJoin = "LEFT JOIN \"accounts\" a ON a.id = e.\"accountId\"";
  } else if (groupBy === "country") {
    groupSelect = ", a.country as group_value";
    groupJoin = "LEFT JOIN \"accounts\" a ON a.id = e.\"accountId\"";
  } else {
    groupSelect = ", NULL as group_value";
  }

  let valueExpr = "COUNT(*)";
  if (metric === "users.dau") {
    valueExpr = "COUNT(DISTINCT e.\"productUserId\")";
  } else if (metric === "adoption.rate") {
    // adoption rate approximated: distinct users fired event / distinct active users in period
    valueExpr = "COUNT(DISTINCT e.\"productUserId\")::float";
  }

  const sql = `
    WITH series AS (
      SELECT generate_series(date_trunc('${interval}', $2::timestamptz), date_trunc('${interval}', $3::timestamptz), '${bin}'::interval) AS ts
    ),
    base AS (
      SELECT date_trunc('${interval}', e.ts) AS bucket${groupSelect}, ${valueExpr} AS v
      FROM "events" e
      ${groupJoin}
      ${whereClause}
      GROUP BY 1, 2
    )
    SELECT s.ts AS bucket, b.group_value, COALESCE(b.v, 0) AS v
    FROM series s
    LEFT JOIN base b ON b.bucket = s.ts
    ORDER BY 1 ASC
  `;

  const rows: any[] = await prisma.$queryRawUnsafe(sql, ...params);

  const series: SeriesPoint[] = rows.map((r) => ({
    t: new Date(r.bucket).toISOString(),
    value: Number(r.v) || 0,
    group: r.group_value ?? null,
  }));

  const totals = series.reduce((acc, p) => acc + p.value, 0);

  // Normalize table rows to be JSON-serializable (no BigInt)
  const table = rows.map((r) => ({
    bucket: new Date(r.bucket).toISOString(),
    group: r.group_value ?? null,
    value: Number(r.v) || 0,
  }));

  return { series, totals, table };
}


