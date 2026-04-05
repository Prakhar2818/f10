import { FastifyInstance } from "fastify";
import { healthController } from "./health.controller";

export const healthRoutes = async (app: FastifyInstance) => {
  app.get("/", healthController.healthCheck);
};
