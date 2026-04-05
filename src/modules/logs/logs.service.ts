import { logger } from "../../config/logger";
import { LogModel } from "./logs.model";

type LogLevel = "info" | "warn" | "error";

type StoreLogInput = {
  level: LogLevel;
  message: string;
  context?: string;
  method?: string;
  route?: string;
  url?: string;
  statusCode?: number;
  durationMs?: number;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: unknown;
  stack?: string;
};

export const logsService = {
  storeLog: async (input: StoreLogInput) => {
    try {
      await LogModel.create(input);
    } catch (error) {
      logger.error(
        {
          error,
          context: input.context || "application",
          message: input.message,
        },
        "Failed to store log in MongoDB",
      );
    }
  },
};
