import { usersRepository } from "./users.repository";
import {
  AdminCreateUserInput,
  UpdateUserInput,
  UpdateUserStatusInput,
} from "./users.schema";
import { hashPassword } from "../../utils/hash";

export const usersService = {
  getAllUsers: async () => {
    const users = await usersRepository.findAllUsers();

    return users.map((user) => ({
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
      throw new Error("User not found");
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
    throw new Error("User already exists with this email");
  }

  // 2. Get role
  const role = await usersRepository.findRoleByName(payload.role);

  if (!role) {
    throw new Error("Invalid role");
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
      throw new Error("User not found");
    }

    let roleId: string | undefined = undefined;

    if (payload.role) {
      const role = await usersRepository.findRoleByName(payload.role);

      if (!role) {
        throw new Error("Invalid role");
      }

      roleId = role.id;
    }

    if (payload.email && payload.email !== existingUser.email) {
      const emailTaken = await usersRepository.findUserByEmail(payload.email);

      if (emailTaken) {
        throw new Error("Email is already in use");
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
      throw new Error("User not found");
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
