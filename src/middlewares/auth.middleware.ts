import { FastifyReply, FastifyRequest } from "fastify";
import { authRepository } from "../modules/auth/auth.repository";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({
        success: false,
        message: "Unauthorized: Token missing or invalid format",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);
    const user = await authRepository.findUserById(decoded.userId);

    if (!user || user.status !== "ACTIVE") {
      return reply.status(401).send({
        success: false,
        message: "Unauthorized: User not found or inactive",
      });
    }

    request.user = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
    };
  } catch (error) {
    return reply.status(401).send({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
