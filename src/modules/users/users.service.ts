import { usersRepository } from "./users.repository";
import {
  AdminCreateUserInput,
  UpdateUserInput,
  UpdateUserStatusInput,
} from "./users.schema";
import { hashPassword } from "../../utils/hash";
import { AppError } from "../../utils/appError";

export const usersService = {
  getAllUsers: async () => {
    const users = await usersRepository.findAllUsers();

    return users.map((user: (typeof users)[number]) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.name,
      status: user.status,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    }));
  },

  getUserById: async (id: string) => {
    const user = await usersRepository.findUserById(id);

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
      lastLoginAt: user.lastLoginAt,
    };
  },

adminCreateUser: async (payload: AdminCreateUserInput) => {
  // 1. Check if user already exists
  const existingUser = await usersRepository.findUserByEmail(payload.email);

  if (existingUser) {
    throw new AppError("User already exists with this email", 409);
  }

  // 2. Get role
  const role = await usersRepository.findRoleByName(payload.role);

  if (!role) {
    throw new AppError("Invalid role", 400);
  }

  // 3. Hash password
  const passwordHash = await hashPassword(payload.password);

  // 4. Create user
  const user = await usersRepository.createUser({
    fullName: payload.fullName,
    email: payload.email,
    passwordHash,
    roleId: role.id,
  });

  // 5. Return clean response
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role.name,
    status: user.status,
  };
},

  updateUser: async (id: string, payload: UpdateUserInput) => {
    const existingUser = await usersRepository.findUserById(id);

    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    let roleId: string | undefined = undefined;

    if (payload.role) {
      const role = await usersRepository.findRoleByName(payload.role);

      if (!role) {
        throw new AppError("Invalid role", 400);
      }

      roleId = role.id;
    }

    if (payload.email && payload.email !== existingUser.email) {
      const emailTaken = await usersRepository.findUserByEmail(payload.email);

      if (emailTaken) {
        throw new AppError("Email is already in use", 409);
      }
    }

    const updatedUser = await usersRepository.updateUser(id, {
      fullName: payload.fullName,
      email: payload.email,
      roleId,
    });

    return {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role.name,
      status: updatedUser.status,
      updatedAt: updatedUser.updatedAt,
    };
  },

  updateUserStatus: async (id: string, payload: UpdateUserStatusInput) => {
    const existingUser = await usersRepository.findUserById(id);

    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    const updatedUser = await usersRepository.updateUserStatus(
      id,
      payload.status,
    );

    return {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role.name,
      status: updatedUser.status,
    };
  },
};
