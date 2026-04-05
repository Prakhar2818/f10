import { prisma } from "../config/prisma";

async function main() {
  const roles = ["ADMIN", "ANALYST", "VIEWER"];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName as any },
      update: {},
      create: {
        name: roleName as any,
      },
    });
  }

  console.log("Roles seeded successfully");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
