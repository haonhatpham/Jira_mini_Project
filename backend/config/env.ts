/**
 * File doc va chuan hoa bien moi truong runtime cua backend.
 */
import "dotenv/config";

type NodeEnv = "development" | "test" | "production";

/**
 * Lay bien moi truong dang string, co default thi dung default khi env thieu.
 */
function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing String environment variable for ${key}`);
  }

  return value;
}

/**
 * Lay bien moi truong dang so nguyen va validate min/max neu co.
 */
function getIntegerEnv(
  key: string,
  defaultValue: number,
  options: {
    max?: number;
    min?: number;
  } = {},
): number {
  const rawValue = getEnv(key, String(defaultValue));
  const value = Number(rawValue);

  if (!Number.isInteger(value)) {
    throw new Error(`${key} must be an integer.`);
  }

  if (options.min !== undefined && value < options.min) {
    throw new Error(`${key} must be greater than or equal to ${options.min}.`);
  }

  if (options.max !== undefined && value > options.max) {
    throw new Error(`${key} must be less than or equal to ${options.max}.`);
  }

  return value;
}

/**
 * Validate NODE_ENV de tranh typo nhu "prod" lam app chay sai mode.
 */
function getNodeEnv(): NodeEnv {
  const value = getEnv("NODE_ENV", "development");

  if (value === "development" || value === "test" || value === "production") {
    return value;
  }

  throw new Error("NODE_ENV must be development, test, or production.");
}

export const NODE_ENV = getNodeEnv();
export const PORT = getIntegerEnv("PORT", 3001, {
  max: 65535,
  min: 1,
});
export const DATABASE_URL = getEnv("DATABASE_URL");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_EXPIRES_IN = getEnv("JWT_EXPIRES_IN", "1h");
export const PASSWORD_SALT_ROUNDS = getIntegerEnv("PASSWORD_SALT_ROUNDS", 10, {
  min: 10,
});

export const env = {
  DATABASE_URL,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  NODE_ENV,
  PASSWORD_SALT_ROUNDS,
  PORT,
} as const;
