import { FastifyReply, FastifyRequest } from "fastify";

export const healthController = {
  healthCheck: async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      success: true,
      message: "Server is healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  },
};
