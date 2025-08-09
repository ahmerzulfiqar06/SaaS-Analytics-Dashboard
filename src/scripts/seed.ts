import 'dotenv/config';
import { PrismaClient, Plan, Role } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const ws = await prisma.workspace.upsert({
    where: { id: "demo" },
    update: {},
    create: { id: "demo", name: "Demo Workspace" },
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@example.com" },
    update: {},
    create: { email: "owner@example.com", name: "Owner" },
  });

  await prisma.member.upsert({
    where: { workspaceId_userId: { workspaceId: ws.id, userId: owner.id } },
    update: {},
    create: { workspaceId: ws.id, userId: owner.id, role: Role.owner },
  });

  const plans = [Plan.free, Plan.pro, Plan.enterprise] as const;
  const accounts = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.customerAccount.create({
        data: {
          workspaceId: ws.id,
          name: `Company ${i + 1}`,
          plan: plans[i % plans.length],
          country: ["US", "DE", "IN"][i % 3],
        },
      }),
    ),
  );

  for (const acc of accounts) {
    const users = await Promise.all(
      Array.from({ length: 10 }).map((_, i) =>
        prisma.productUser.create({
          data: {
            workspaceId: ws.id,
            accountId: acc.id,
            email: `user${i + 1}.${acc.id.slice(0, 4)}@example.com`,
            name: `User ${i + 1}`,
          },
        }),
      ),
    );

    // initial events
    const now = new Date();
    for (const u of users) {
      for (let d = 7; d >= 0; d--) {
        const ts = new Date(now.getTime() - d * 86400000);
        await prisma.event.create({
          data: {
            workspaceId: ws.id,
            accountId: acc.id,
            productUserId: u.id,
            name: "page_view",
            ts,
            props: { path: "/", plan: acc.plan, country: acc.country },
          },
        });
      }
    }
  }

  console.log("Seed complete");
}

main().finally(() => prisma.$disconnect());


