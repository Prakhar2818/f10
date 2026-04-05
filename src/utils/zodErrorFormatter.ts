import { ZodError } from "zod";

export const formatZodError = (error: ZodError) => {
  const formatted: Record<string, string> = {};

  error.issues.forEach((err) => {
    const field = err.path.join(".");
    formatted[field] = err.message;
  });

  return formatted;
};