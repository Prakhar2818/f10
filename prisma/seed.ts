import { prisma } from "../src/config/prisma";

async function main() {
  const roles = [
    {
      name: "ADMIN",
      description: "Can manage users and records",
    },
    {
      name: "ANALYST",
      description: "Can view records and analytics",
    },
    {
      name: "VIEWER",
      description: "Can only view dashboard data and records",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {
        description: role.description,
      },
      create: role,
    });
  }

  console.log("Roles seeded successfully");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
