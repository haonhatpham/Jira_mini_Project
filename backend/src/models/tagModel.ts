/**
 * File model tag: truy van bang tags bang Prisma.
 */
import type { NamedEntity } from "../types/option.js";
import { prisma, withPrismaErrorHandling } from "../config/prisma.js";
import {
  ConflictException,
  NotFoundException,
} from "../exceptions/index.js";

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

/**
 * Tao tag moi, tranh trung ten.
 */
export async function createTag(name: string): Promise<NamedEntity> {
  return withPrismaErrorHandling(createTagUnchecked(name));
}

/**
 * Doi ten tag; product_tags giu tagId nen product tu dong nhan ten moi.
 */
export async function updateTag(id: number, name: string): Promise<NamedEntity> {
  return withPrismaErrorHandling(updateTagUnchecked(id, name));
}

/**
 * Xoa tag chi khi tag chua duoc gan vao product nao.
 */
export async function deleteTag(id: number): Promise<void> {
  await withPrismaErrorHandling(deleteTagUnchecked(id));
}

async function createTagUnchecked(name: string): Promise<NamedEntity> {
  await assertTagNameAvailable(name);

  return prisma.tag.create({
    data: {
      name,
    },
    select: {
      id: true,
      name: true,
    },
  });
}

async function updateTagUnchecked(
  id: number,
  name: string,
): Promise<NamedEntity> {
  const tag = await prisma.tag.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!tag) {
    throw new NotFoundException("Tag not found");
  }

  await assertTagNameAvailable(name, id);

  return prisma.tag.update({
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

async function deleteTagUnchecked(id: number): Promise<void> {
  const tag = await prisma.tag.findUnique({
    where: {
      id,
    },
    select: {
      _count: {
        select: {
          productTags: true,
        },
      },
    },
  });

  if (!tag) {
    throw new NotFoundException("Tag not found");
  }

  if (tag._count.productTags > 0) {
    throw new ConflictException("Tag is used by products");
  }

  await prisma.tag.delete({
    where: {
      id,
    },
  });
}

async function assertTagNameAvailable(
  name: string,
  currentId?: number,
): Promise<void> {
  const existingTag = await prisma.tag.findUnique({
    where: {
      name,
    },
    select: {
      id: true,
    },
  });

  if (existingTag && existingTag.id !== currentId) {
    throw new ConflictException("Tag already exists");
  }
}
