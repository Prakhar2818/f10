import { z } from "zod";

const roleSchema = z.enum(["VIEWER", "ANALYST", "ADMIN"]);

export const adminCreateUserSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: roleSchema.optional(),
    roleName: roleSchema.optional(),
  })
  .refine((data) => data.role || data.roleName, {
    message: "Role is required",
    path: ["role"],
  })
  .transform((data) => ({
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    role: data.role ?? data.roleName!,
  }));

export const updateUserSchema = z.object({
  fullName: z.string().min(3).optional(),
  email: z.string().email().optional(),
  role: z.enum(["VIEWER", "ANALYST", "ADMIN"]).optional(),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
