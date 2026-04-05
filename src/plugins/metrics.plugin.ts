import { FastifyInstance } from 'fastify';
import client from 'prom-client';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

register.registerMetric(httpRequestsTotal);

export const registerMetrics = async (app: FastifyInstance) => {
  app.addHook('onResponse', async (request, reply) => {
    httpRequestsTotal.inc({
      method: request.method,
      route: request.routeOptions.url || request.url,
      status_code: reply.statusCode,
    });
  });

  app.get('/metrics', async (_, reply) => {
    reply.header('Content-Type', register.contentType);
    return register.metrics();
  });
};