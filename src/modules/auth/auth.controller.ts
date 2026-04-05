import { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schema";
import { successResponse } from "../../utils/response";

export const authController = {
  register: async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = registerSchema.parse(request.body);

    const user = await authService.register(parsed);

    return reply
      .status(201)
      .send(successResponse("User registered successfully", user));
  },

  login: async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = loginSchema.parse(request.body);

    const result = await authService.login(parsed, {
      ipAddress: request.ip,
      userAgent: request.headers["user-agent"],
    });

    reply.setCookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    return reply.status(200).send(
      successResponse("Login successful", {
        accessToken: result.accessToken,
        user: result.user,
      }),
    );
  },

  refresh: async (request: FastifyRequest, reply: FastifyReply) => {
    const cookies = request.cookies as { refreshToken?: string };
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return reply.status(401).send({
        success: false,
        message: "Refresh token not found",
      });
    }

    const result = await authService.refreshToken(refreshToken);

    reply.setCookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    return reply.status(200).send(
      successResponse("Token refreshed successfully", {
        accessToken: result.accessToken,
      }),
    );
  },

  logout: async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    await authService.logout(request.user.userId);

    reply.clearCookie("refreshToken", {
      path: "/",
    });

    return reply.status(200).send(successResponse("Logout successful"));
  },

  me: async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await authService.getCurrentUser(request.user.userId);

    return reply
      .status(200)
      .send(successResponse("Current user fetched successfully", user));
  },
};
