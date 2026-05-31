/**
 * File model category: truy van bang categories bang Prisma.
 */
import type { NamedEntity } from "../types/option.js";
import { prisma, withPrismaErrorHandling } from "../config/prisma.js";

/**
 * Lay tat ca category, sap xep theo ten tang dan.
 */
export async function findAllCategories(): Promise<NamedEntity[]> {
  return withPrismaErrorHandling(
    prisma.category.findMany({
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
