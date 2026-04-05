import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';

export const registerRateLimit = async (app: FastifyInstance) => {
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
};