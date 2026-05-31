/**
 * File model tag: truy van bang tags bang Prisma.
 */
import type { NamedEntity } from "../types/option.js";
import { prisma, withPrismaErrorHandling } from "../config/prisma.js";

/**
 * Lay tat ca tag, sap xep theo ten tang dan.
 */
export async function findAllTags(): Promise<NamedEntity[]> {
  return withPrismaErrorHandling(
    prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
  );
}
