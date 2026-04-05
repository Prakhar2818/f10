import { authRepository } from "./auth.repository";
import { RegisterInput, LoginInput } from "./auth.schema";
import { hashPassword, comparePassword } from "../../utils/hash";
import { AppError } from "../../utils/appError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import bcrypt from "bcrypt";

export const authService = {
  register: async (payload: RegisterInput) => {
    const existingUser = await authRepository.findUserByEmail(payload.email);

    if (existingUser) {
      throw new AppError("User already exists with this email", 409);
    }

    const roleName = "VIEWER";

    const role = await authRepository.findRoleByName(roleName);

    if (!role) {
      throw new AppError("Invalid role", 400);
    }

    const passwordHash = await hashPassword(payload.password);

    const user = await authRepository.createUser({
      fullName: payload.fullName,
      email: payload.email,
      passwordHash,
      roleId: role.id,
    });

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.name,
      status: user.status,
    };
  },

  login: async (
    payload: LoginInput,
    meta: { ipAddress?: string; userAgent?: string },
  ) => {
    const user = await authRepository.findUserByEmail(payload.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (user.status !== "ACTIVE") {
      throw new AppError("Your account is inactive", 403);
    }

    const isPasswordValid = await comparePassword(
      payload.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const jwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
    };

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await authRepository.createRefreshSession({
      userId: user.id,
      refreshTokenHash,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      expiresAt,
    });

    await authRepository.updateLastLogin(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role.name,
        status: user.status,
      },
    };
  },

  refreshToken: async (refreshToken: string) => {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await authRepository.findUserById(decoded.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const session = await authRepository.findRefreshSessionByUserId(user.id);

    if (!session || session.revokedAt) {
      throw new AppError("Invalid or expired refresh session", 401);
    }

    const isValid = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isValid) {
      throw new AppError("Invalid refresh token", 401);
    }

    const newPayload = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
    };

    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

    await authRepository.revokeRefreshSession(session.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await authRepository.createRefreshSession({
      userId: user.id,
      refreshTokenHash: newRefreshTokenHash,
      expiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  logout: async (userId: string) => {
    await authRepository.revokeAllUserSessions(userId);

    return {
      message: "Logged out successfully",
    };
  },

  getCurrentUser: async (userId: string) => {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.name,
      status: user.status,
      createdAt: user.createdAt,
    };
  },
};
