/**
 * File model category: truy van bang categories bang Prisma.
 */
import type { NamedEntity } from "../types/option.js";
import { prisma, withPrismaErrorHandling } from "../config/prisma.js";
import {
  ConflictException,
  NotFoundException,
} from "../exceptions/index.js";

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

/**
 * Tao category moi, tranh trung ten de UI bao loi ro rang.
 */
export async function createCategory(name: string): Promise<NamedEntity> {
  return withPrismaErrorHandling(createCategoryUnchecked(name));
}

/**
 * Doi ten category; product lien quan giu categoryId nen tu dong nhan ten moi.
 */
export async function updateCategory(
  id: number,
  name: string,
): Promise<NamedEntity> {
  return withPrismaErrorHandling(updateCategoryUnchecked(id, name));
}

/**
 * Xoa category chi khi chua co product nao su dung.
 */
export async function deleteCategory(id: number): Promise<void> {
  await withPrismaErrorHandling(deleteCategoryUnchecked(id));
}

async function createCategoryUnchecked(name: string): Promise<NamedEntity> {
  await assertCategoryNameAvailable(name);

  return prisma.category.create({
    data: {
      name,
    },
    select: {
      id: true,
      name: true,
    },
  });
}

async function updateCategoryUnchecked(
  id: number,
  name: string,
): Promise<NamedEntity> {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    throw new NotFoundException("Category not found");
  }

  await assertCategoryNameAvailable(name, id);

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
    },
    select: {
      id: true,
      name: true,
    },
  });
}

async function deleteCategoryUnchecked(id: number): Promise<void> {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    select: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!category) {
    throw new NotFoundException("Category not found");
  }

  if (category._count.products > 0) {
    throw new ConflictException("Category is used by products");
  }

  await prisma.category.delete({
    where: {
      id,
    },
  });
}

async function assertCategoryNameAvailable(
  name: string,
  currentId?: number,
): Promise<void> {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name,
    },
    select: {
      id: true,
    },
  });

  if (existingCategory && existingCategory.id !== currentId) {
    throw new ConflictException("Category already exists");
  }
}
