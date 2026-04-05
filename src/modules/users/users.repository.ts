import { prisma } from "../../config/prisma";

export const usersRepository = {
  findAllUsers: async () => {
    return prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: "desc" },
    });
  },

  findUserById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  },

  findUserByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  },

  findRoleByName: async (name: string) => {
    return prisma.role.findUnique({
      where: { name },
    });
  },

  createUser: async (data: {
    fullName: string;
    email: string;
    passwordHash: string;
    roleId: string;
  }) => {
    return prisma.user.create({
      data,
      include: { role: true },
    });
  },

  updateUser: async (
    id: string,
    data: {
      fullName?: string;
      email?: string;
      roleId?: string;
    },
  ) => {
    return prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    });
  },

  updateUserStatus: async (id: string, status: "ACTIVE" | "INACTIVE") => {
    return prisma.user.update({
      where: { id },
      data: { status },
      include: { role: true },
    });
  },
};
