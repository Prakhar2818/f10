import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export const globalErrorHandler = (
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  const statusCode = error.statusCode || 500;

  reply.status(statusCode).send({
    success: false,
    message: error.message || 'Internal Server Error',
    errors: error.validation || null,
  });
};