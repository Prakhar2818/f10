import { FastifyInstance } from "fastify";
import { authController } from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const contentTypeHandler = async (request: any) => {
  if (!request.headers["content-type"]) {
    request.headers["content-type"] = "application/json";
  }
};

export const authRoutes = async (app: FastifyInstance) => {
  app.post("/register", authController.register);
  app.post("/login", authController.login);
  app.post(
    "/refresh",
    { preHandler: [contentTypeHandler] },
    authController.refresh
  );
  app.post(
    "/logout",
    { preHandler: [authenticate, contentTypeHandler] },
    authController.logout
  );
  app.get("/me", { preHandler: [authenticate] }, authController.me);
};
