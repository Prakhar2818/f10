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
import { globalErrorHandler } from "./middlewares/error.middleware";

import { authRoutes } from "./modules/auth/auth.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { healthRoutes } from "./modules/health/health.routes";
import recordsRoutes from './modules/records/records.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';

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

  // Global error handler
  app.setErrorHandler(globalErrorHandler);

  // Root route
  app.get("/", async () => {
    return {
      success: true,
      message: "Finance Dashboard Backend is running 🚀",
    };
  });

  await app.register(authRoutes, { prefix: "/api/v1/auth" });
  await app.register(healthRoutes, { prefix: "/api/v1/health" });
  await app.register(usersRoutes, { prefix: "/api/v1/users" });
  app.register(recordsRoutes, { prefix: '/api/v1/records' });
  app.register(dashboardRoutes, { prefix: '/api/v1/dashboard' });

  return app;
};
