/**
 * File Prisma client: tao singleton client va chuan hoa loi database.
 */
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { ServiceUnavailableException } from "../exceptions/index.js";
import { env } from "./env.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DATABASE_POOL_MAX,
  idleTimeoutMillis: env.DATABASE_POOL_IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: env.DATABASE_POOL_CONNECTION_TIMEOUT_MS,
});

const adapter = new PrismaPg(pool);
/**
 * Shared Prisma Client instance.
 */
export const prisma = new PrismaClient({
  adapter,
});

/**
 * Chay Prisma operation va doi loi ket noi/config database thanh HTTP 503.
 */
export async function withPrismaErrorHandling<T>(operation: Promise<T>): Promise<T> {
  try {
    return await operation;
  } catch (err) {
    if (isDatabaseUnavailableError(err)) {
      throw new ServiceUnavailableException("Database unavailable");
    }

    throw err;
  }
}

/**
 * Nhan dien cac loi ket noi/cau hinh Prisma/PostgreSQL pho bien.
 */
function isDatabaseUnavailableError(err: unknown): boolean {
  if (!isErrorLike(err)) {
    return false;
  }

  const databaseErrorCodes = [
    "P1000",
    "P1001",
    "P1002",
    "P1003",
    "P1017",
    "ECONNREFUSED",
    "ENOTFOUND",
    "ETIMEDOUT",
    "EAI_AGAIN",
  ];

  return (err.code !== undefined && databaseErrorCodes.includes(err.code))
    || err.message.includes("Can't reach database server")
    || err.message.includes("Authentication failed")
    || err.message.includes("Database unavailable");
}

/**
 * Type guard cho object loi co message va co the co code.
 */
function isErrorLike(err: unknown): err is { code?: string; message: string } {
  return typeof err === "object"
    && err !== null
    && "message" in err
    && typeof (err as { message?: unknown }).message === "string";
}
