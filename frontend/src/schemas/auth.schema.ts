import { z } from "zod";
import {
  AUTH_VALIDATION,
  REQUIRED_TEXT_LENGTH,
} from "../configs/validation.config";

export const USER_ROLES = ["admin", "customer"] as const;
export const userRoleSchema = z.enum(USER_ROLES);

export const usernameSchema = z
  .string()
  .trim()
  .min(REQUIRED_TEXT_LENGTH, "Username is required.")
  .min(
    AUTH_VALIDATION.USERNAME_MIN_LENGTH,
    "Username must be at least 3 characters.",
  )
  .max(80, "Username must not exceed 80 characters.");

export const emailSchema = z
  .string()
  .trim()
  .min(REQUIRED_TEXT_LENGTH, "Email is required.")
  .email("Email must be valid.")
  .max(255, "Email must not exceed 255 characters.");

const passwordSchema = z
  .string()
  .min(REQUIRED_TEXT_LENGTH, "Password is required.")
  .min(
    AUTH_VALIDATION.PASSWORD_MIN_LENGTH,
    "Password must be at least 6 characters.",
  )
  .max(255, "Password must not exceed 255 characters.");

export const loginCredentialsSchema = z.strictObject({
  username: usernameSchema,
  password: passwordSchema,
});

export const registerCredentialsSchema = loginCredentialsSchema
  .extend({
    email: emailSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type UserRole = z.infer<typeof userRoleSchema>;
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type RegisterCredentials = z.infer<typeof registerCredentialsSchema>;
