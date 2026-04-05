import { FastifyReply, FastifyRequest } from "fastify";
import { ROLE_PERMISSIONS } from "../utils/permissions";

export const authorize = (requiredPermissions: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    if (!user) {
      return reply.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    const userPermissions = ROLE_PERMISSIONS[user.role] || [];

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      return reply.status(403).send({
        success: false,
        message: "Forbidden: Insufficient permissions",
      });
    }
  };
};
