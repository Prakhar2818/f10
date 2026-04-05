import { FastifyInstance } from "fastify";
import { logsService } from "../modules/logs/logs.service";

export const registerMongoLogger = async (app: FastifyInstance) => {
  app.addHook("onRequest", async (request) => {
    request.log.info(
      {
        requestId: request.id,
        method: request.method,
        url: request.url,
      },
      "Incoming request",
    );

    (request as typeof request & { startTime: number }).startTime = Date.now();
  });

  app.addHook("onResponse", async (request, reply) => {
    if (request.url === "/metrics") {
      return;
    }

    const startedAt =
      (request as typeof request & { startTime?: number }).startTime ||
      Date.now();
    const durationMs = Date.now() - startedAt;
    const level = reply.statusCode >= 500 ? "error" : reply.statusCode >= 400 ? "warn" : "info";
    const userAgent = request.headers["user-agent"];

    void logsService.storeLog({
      level,
      message: "HTTP request completed",
      context: "http",
      method: request.method,
      route: request.routeOptions.url || request.url,
      url: request.url,
      statusCode: reply.statusCode,
      durationMs,
      requestId: request.id,
      ipAddress: request.ip,
      userAgent: typeof userAgent === "string" ? userAgent : undefined,
    });
  });
};
