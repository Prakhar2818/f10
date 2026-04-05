import { prisma } from "../../config/prisma";

export const authRepository = {
  findUserByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  },

  findUserById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
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

  findRoleByName: async (name: string) => {
    return prisma.role.findUnique({
      where: { name },
    });
  },

  updateLastLogin: async (userId: string) => {
    return prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
      },
    });
  },

  createRefreshSession: async (data: {
    userId: string;
    refreshTokenHash: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }) => {
    return prisma.refreshSession.create({
      data,
    });
  },

  findRefreshSessionByUserId: async (userId: string) => {
    return prisma.refreshSession.findFirst({
      where: {
        userId,
        revokedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  revokeRefreshSession: async (id: string) => {
    return prisma.refreshSession.update({
      where: { id },
      data: {
        revokedAt: new Date(),
      },
    });
  },

  revokeAllUserSessions: async (userId: string) => {
    return prisma.refreshSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },
};
