/**
 * File model user: truy van bang users bang Prisma va map sang UserRecord.
 */
import type { User } from "../../generated/prisma/client.js";
import { prisma, withPrismaErrorHandling } from "../config/prisma.js";
import { isUserRole } from "../schemas/authSchemas.js";
import type { CreateUserInput, UserRecord } from "../types/user.js";

/**
 * Lay tat ca user noi bo, bao gom password hash cho cac use case can auth.
 */
export async function findAllUsers(): Promise<UserRecord[]> {
  const users = await withPrismaErrorHandling(
    prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    }),
  );

  return users.map(mapUserRecord);
}

/**
 * Tim user theo username khong phan biet hoa thuong.
 */
export async function findUserByUsername(username: string): Promise<UserRecord | null> {
  const user = await withPrismaErrorHandling(
    prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    }),
  );

  return user ? mapUserRecord(user) : null;
}

/**
 * Tim user theo email khong phan biet hoa thuong.
 */
export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const user = await withPrismaErrorHandling(
    prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    }),
  );

  return user ? mapUserRecord(user) : null;
}

/**
 * Tim user theo id, tra null neu khong ton tai.
 */
export async function findUserById(id: number): Promise<UserRecord | null> {
  const user = await withPrismaErrorHandling(
    prisma.user.findUnique({
      where: {
        id,
      },
    }),
  );

  return user ? mapUserRecord(user) : null;
}

/**
 * Tao user moi va tra ve record vua duoc database insert.
 */
export async function createUser(userInput: CreateUserInput): Promise<UserRecord> {
  const user = await withPrismaErrorHandling(
    prisma.user.create({
      data: {
        email: userInput.email,
        passwordHash: userInput.password,
        role: userInput.role,
        username: userInput.username,
      },
    }),
  );

  return mapUserRecord(user);
}

/**
 * Map Prisma User sang UserRecord noi bo va validate role lay tu database.
 */
function mapUserRecord(user: User): UserRecord {
  if (!isUserRole(user.role)) {
    throw new Error(`Unknown user role from database: ${user.role}`);
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    password: user.passwordHash,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
