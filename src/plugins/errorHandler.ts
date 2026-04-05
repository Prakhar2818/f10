import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";
import { formatZodError } from "../utils/zodErrorFormatter";
import { errorResponse } from "../utils/response";
import { logsService } from "../modules/logs/logs.service";

export async function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: unknown, request, reply) => {
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : undefined;
    const userAgent = request.headers["user-agent"];

    request.log.error({
      message,
      stack,
    });

    void logsService.storeLog({
      level: "error",
      message,
      context: "error-handler",
      method: request.method,
      route: request.routeOptions.url || request.url,
      url: request.url,
      statusCode:
        error instanceof AppError
          ? error.statusCode
          : error instanceof ZodError
            ? 400
            : 500,
      requestId: request.id,
      ipAddress: request.ip,
      userAgent: typeof userAgent === "string" ? userAgent : undefined,
      details:
        error instanceof ZodError
          ? formatZodError(error)
          : error instanceof AppError
            ? error.errors
            : null,
      stack,
    });

    // Zod validation error
    if (error instanceof ZodError) {
      return reply.status(400).send(
        errorResponse("Validation Error", formatZodError(error))
      );
    }

    // Custom App Error
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(
        errorResponse(error.message, error.errors)
      );
    }

    // Prisma errors (optional handling)
    const prismaError = error as { code?: string; meta?: unknown };
    if (prismaError.code === "P2002") {
      return reply.status(400).send(
        errorResponse("Duplicate field value", prismaError.meta)
      );
    }

    // Default error
    return reply.status(500).send(
      errorResponse(
        error instanceof Error ? error.message : "Internal Server Error",
        null
      )
    );
  });
}
