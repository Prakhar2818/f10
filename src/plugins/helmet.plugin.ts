import helmet from '@fastify/helmet';
import { FastifyInstance } from 'fastify';

export const registerHelmet = async (app: FastifyInstance) => {
  await app.register(helmet);
};