import { FastifyReply, FastifyRequest } from "fastify";
import { usersService } from "./users.service";
import {
  adminCreateUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
} from "./users.schema";
import { successResponse } from "../../utils/response";

export const usersController = {
  getAllUsers: async (_request: FastifyRequest, reply: FastifyReply) => {
    const users = await usersService.getAllUsers();

    return reply
      .status(200)
      .send(successResponse("Users fetched successfully", users));
  },

  getUserById: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const user = await usersService.getUserById(request.params.id);

    return reply
      .status(200)
      .send(successResponse("User fetched successfully", user));
  },

  adminCreateUser: async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = adminCreateUserSchema.parse(request.body);

    const user = await usersService.adminCreateUser(parsed);

    return reply
      .status(201)
      .send(successResponse("User created successfully", user));
  },

  updateUser: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const parsed = updateUserSchema.parse(request.body);

    const updatedUser = await usersService.updateUser(
      request.params.id,
      parsed,
    );

    return reply
      .status(200)
      .send(successResponse("User updated successfully", updatedUser));
  },

  updateUserStatus: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const parsed = updateUserStatusSchema.parse(request.body);

    const updatedUser = await usersService.updateUserStatus(
      request.params.id,
      parsed,
    );

    return reply
      .status(200)
      .send(successResponse("User status updated successfully", updatedUser));
  },
};
