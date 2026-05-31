/**
 * File schema auth: validate role va login/register request body.
 */
import { z } from "zod";

export const USER_ROLES = ["admin", "customer"] as const;
export const userRoleSchema = z.enum(USER_ROLES);

export const usernameSchema = z
  .string()
  .trim()
  .min(1, "Username is required.")
  .min(3, "Username must be at least 3 characters.")
  .max(80, "Username must not exceed 80 characters.");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Email must be valid.")
  .max(255, "Email must not exceed 255 characters.");

const passwordSchema = z
  .string()
  .min(1, "Password is required.")
  .min(6, "Password must be at least 6 characters.")
  .max(255, "Password must not exceed 255 characters.");

export const loginSchema = z.strictObject({
  username: usernameSchema,
  password: passwordSchema,
});

export const registerSchema = loginSchema
  .extend({
    email: emailSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginRequestSchema = z.object({
  body: loginSchema,
});

export const registerRequestSchema = z.object({
  body: registerSchema,
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;

/**
 * Type guard kiem tra gia tri co phai UserRole hop le hay khong.
 */
export function isUserRole(value: unknown): value is UserRole {
  return userRoleSchema.safeParse(value).success;
}
