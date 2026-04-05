import session from '@fastify/session';
import { FastifyInstance } from 'fastify';
import { env } from '../config/env';

export const registerSession = async (app: FastifyInstance) => {
  await app.register(session, {
    secret: env.SESSION_SECRET,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  });
};