import { NextResponse } from "next/server";
import { exec } from "node:child_process";

export async function POST(_req: Request): Promise<Response> {
  // Run seed script via tsx
  return new Promise<Response>((resolve) => {
    exec(
      "node --loader tsx ./src/scripts/seed.ts",
      { cwd: process.cwd() },
      (error, stdout, stderr) => {
        if (error) {
          resolve(
            NextResponse.json(
              { error: stderr || (error as Error).message },
              { status: 500 },
            ),
          );
        } else {
          resolve(NextResponse.json({ ok: true, stdout }));
        }
      },
    );
  });
}


