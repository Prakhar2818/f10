import { FastifyInstance } from "fastify";
import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({ register, prefix: "app_" });

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

const httpRequestDurationMs = new client.Histogram({
  name: "http_request_duration_ms",
  help: "HTTP request duration in milliseconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
  registers: [register],
});

const httpRequestsInFlight = new client.Gauge({
  name: "http_requests_in_flight",
  help: "Current number of in-flight HTTP requests",
  registers: [register],
});

const httpErrorsTotal = new client.Counter({
  name: "http_errors_total",
  help: "Total HTTP error responses",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

export const registerMetrics = async (app: FastifyInstance) => {
  app.addHook("onRequest", async (request) => {
    httpRequestsInFlight.inc();
    (request as typeof request & { metricsStartTime: number }).metricsStartTime =
      Date.now();
  });

  app.addHook("onResponse", async (request, reply) => {
    const route = request.routeOptions.url || request.url;
    const statusCode = String(reply.statusCode);
    const startedAt =
      (request as typeof request & { metricsStartTime?: number })
        .metricsStartTime || Date.now();
    const durationMs = Date.now() - startedAt;

    httpRequestsInFlight.dec();

    httpRequestsTotal.inc({
      method: request.method,
      route,
      status_code: statusCode,
    });

    httpRequestDurationMs.observe(
      {
        method: request.method,
        route,
        status_code: statusCode,
      },
      durationMs,
    );

    if (reply.statusCode >= 400) {
      httpErrorsTotal.inc({
        method: request.method,
        route,
        status_code: statusCode,
      });
    }
  });

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      message: `Route ${request.method} ${request.url} not found`,
    });
  });

  app.get("/metrics", async (_, reply) => {
    reply.header("Content-Type", register.contentType);
    return register.metrics();
  });
};
