import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

export const registerSwagger = async (app: FastifyInstance) => {
  await app.register(swagger, {
    swagger: {
      info: {
        title: 'Finance Dashboard Backend API',
        description: 'Finance Data Processing and Access Control Backend',
        version: '1.0.0',
      },
    },
  });

  await app.register(swaggerUI, {
    routePrefix: '/api/docs',
  });
};