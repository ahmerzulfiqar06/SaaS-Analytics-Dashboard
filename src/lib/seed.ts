import { PrismaClient, Plan, Role } from "@/generated/prisma";

export async function seedDatabase(prisma: PrismaClient): Promise<void> {
  const workspace = await prisma.workspace.upsert({
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
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: owner.id } },
    update: {},
    create: { workspaceId: workspace.id, userId: owner.id, role: Role.owner },
  });

  const plans = [Plan.free, Plan.pro, Plan.enterprise] as const;
  const accounts = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.customerAccount.create({
        data: {
          workspaceId: workspace.id,
          name: `Company ${i + 1}`,
          plan: plans[i % plans.length],
          country: ["US", "DE", "IN"][i % 3],
        },
      }),
    ),
  );

  for (const account of accounts) {
    const users = await Promise.all(
      Array.from({ length: 10 }).map((_, i) =>
        prisma.productUser.create({
          data: {
            workspaceId: workspace.id,
            accountId: account.id,
            email: `user${i + 1}.${account.id.slice(0, 4)}@example.com`,
            name: `User ${i + 1}`,
          },
        }),
      ),
    );

    const now = new Date();
    for (const u of users) {
      for (let d = 7; d >= 0; d--) {
        const ts = new Date(now.getTime() - d * 86400000);
        await prisma.event.create({
          data: {
            workspaceId: workspace.id,
            accountId: account.id,
            productUserId: u.id,
            name: "page_view",
            ts,
            props: { path: "/", plan: account.plan, country: account.country },
          },
        });
      }
    }
  }
}


