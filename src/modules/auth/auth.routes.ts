import { FastifyInstance } from "fastify";
import { authController } from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  registerUserSchema,
  loginUserSchema,
  refreshTokenSchema,
  logoutSchema,
  currentUserSchema,
} from "./auth.docs";

const contentTypeHandler = async (request: any) => {
  if (!request.headers["content-type"]) {
    request.headers["content-type"] = "application/json";
  }
};

export const authRoutes = async (app: FastifyInstance) => {
  app.post("/register", { schema: registerUserSchema }, authController.register);
  app.post("/login", { schema: loginUserSchema }, authController.login);
  app.post(
    "/refresh",
    { preHandler: [contentTypeHandler], schema: refreshTokenSchema },
    authController.refresh,
  );
  app.post(
    "/logout",
    { preHandler: [authenticate, contentTypeHandler], schema: logoutSchema },
    authController.logout,
  );
  app.get("/me", { preHandler: [authenticate], schema: currentUserSchema }, authController.me);
};
