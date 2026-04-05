import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { logsService } from '../modules/logs/logs.service';

export const globalErrorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const statusCode = error.statusCode || 500;
  const userAgent = request.headers['user-agent'];

  request.log.error(
    {
      err: error,
      requestId: request.id,
      method: request.method,
      url: request.url,
      statusCode,
    },
    'Request failed',
  );

  void logsService.storeLog({
    level: 'error',
    message: error.message || 'Internal Server Error',
    context: 'error-handler',
    method: request.method,
    route: request.routeOptions.url || request.url,
    url: request.url,
    statusCode,
    requestId: request.id,
    ipAddress: request.ip,
    userAgent: typeof userAgent === 'string' ? userAgent : undefined,
    details: {
      validation: error.validation,
    },
    stack: error.stack,
  });

  reply.status(statusCode).send({
    success: false,
    message: error.message || 'Internal Server Error',
    errors: error.validation || null,
  });
};
