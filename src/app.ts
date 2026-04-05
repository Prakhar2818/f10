import Fastify from "fastify";
import { registerCors } from "./plugins/cors.plugins";
import { registerHelmet } from "./plugins/helmet.plugin";
import { registerCookie } from "./plugins/cookie.plugin";
import { registerSession } from "./plugins/session.plugin";
import { registerSensible } from "./plugins/sensible.plugin";
import { registerSwagger } from "./plugins/swagger.plugin";
import { registerRateLimit } from "./plugins/rateLimit.plugin";
import { registerMetrics } from "./plugins/metrics.plugin";
import { registerMongoLogger } from "./plugins/mongoLogger.plugin";
import { registerErrorHandler } from "./plugins/errorHandler";

import { authRoutes } from "./modules/auth/auth.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { healthRoutes } from "./modules/health/health.routes";
import recordsRoutes from "./modules/records/records.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";

export const buildApp = async () => {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    },
  });

  // Register core plugins
  await registerCors(app);
  await registerHelmet(app);
  await registerCookie(app);
  await registerSession(app);
  await registerSensible(app);
  await registerSwagger(app);
  await registerRateLimit(app);
  await registerMetrics(app);
  await registerMongoLogger(app);

  // Root route
  app.get("/", async () => {
    return {
      success: true,
      message: "Finance Dashboard Backend is running 🚀",
    };
  });

  app.get("/health", async () => {
    return {
      success: true,
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  });

  await app.register(authRoutes, { prefix: "/api/v1/auth" });
  await app.register(healthRoutes, { prefix: "/api/v1/health" });
  await app.register(usersRoutes, { prefix: "/api/v1/users" });
  app.register(recordsRoutes, { prefix: "/api/v1/records" });
  app.register(dashboardRoutes, { prefix: "/api/v1/dashboard" });

  await registerErrorHandler(app);

  return app;
};
