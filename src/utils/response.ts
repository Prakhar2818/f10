export const successResponse = (
  message: string,
  data: unknown = null,
  meta: unknown = null
) => ({
  success: true,
  message,
  data,
  meta,
});

export const errorResponse = (
  message: string,
  errors: unknown = null
) => ({
  success: false,
  message,
  errors,
});