import { prisma } from '../config/prisma';

export const seedRoles = async () => {
  const roles = [
    {
      name: 'VIEWER',
      description: 'Can only view dashboard data and records',
    },
    {
      name: 'ANALYST',
      description: 'Can view records and analytics',
    },
    {
      name: 'ADMIN',
      description: 'Can manage users and records',
    },
  ];

  for (const role of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: role.name },
    });

    if (!existingRole) {
      await prisma.role.create({
        data: role,
      });
      console.log(`Role ${role.name} created`);
    }
  }
};