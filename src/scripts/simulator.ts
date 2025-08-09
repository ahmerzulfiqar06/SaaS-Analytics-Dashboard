import 'dotenv/config';
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function loop() {
  const wsId = "demo";
  const users = await prisma.productUser.findMany({ where: { workspaceId: wsId }, take: 50 });
  if (!users.length) return;
  const u = users[Math.floor(Math.random() * users.length)];
  await prisma.event.create({
    data: {
      workspaceId: wsId,
      accountId: u.accountId!,
      productUserId: u.id,
      name: Math.random() > 0.7 ? "feature_x_used" : "page_view",
      ts: new Date(),
      props: { path: "/dashboard" },
    },
  });
}

async function main() {
  console.log("Simulator running. Press Ctrl+C to stop.");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await loop();
    await new Promise((r) => setTimeout(r, 1000));
  }
}

main().finally(() => prisma.$disconnect());


