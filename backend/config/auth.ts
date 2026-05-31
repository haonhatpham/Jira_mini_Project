/**
 * File cau hinh authentication: JWT secret, thoi gian het han va bcrypt salt.
 */
import { JWT_SECRET } from "./env.js";

export {
  JWT_EXPIRES_IN,
  JWT_SECRET,
  PASSWORD_SALT_ROUNDS,
} from "./env.js";

/**
 * Lay JWT secret da duoc validate trong config/env.ts.
 */
export function getJwtSecret(): string {
  return JWT_SECRET;
}
