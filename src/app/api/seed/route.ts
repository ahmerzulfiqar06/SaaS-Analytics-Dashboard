import { NextRequest, NextResponse } from "next/server";
import { exec } from "node:child_process";

export async function POST(_req: NextRequest) {
  // Run seed script via tsx
  return new Promise((resolve) => {
    exec("node --loader tsx ./src/scripts/seed.ts", { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ error: stderr || error.message }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ ok: true, stdout }));
      }
    });
  });
}


