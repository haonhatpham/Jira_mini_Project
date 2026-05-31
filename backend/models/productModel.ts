/**
 * File model product: truy van products, categories, tags va product_tags bang Prisma.
 */
import { Prisma } from "../generated/prisma/client.js";
import { prisma, withPrismaErrorHandling } from "../config/prisma.js";
import { BadRequestException } from "../exceptions/index.js";
import type {
  ProductCategory,
  ProductFilters,
  ProductQueryOptions,
  ProductRequest,
  ProductSortField,
} from "../schemas/productSchemas.js";
import type { Product, ProductListResult } from "../types/product.js";

const productInclude = {
  category: true,
  productTags: {
    include: {
      tag: true,
    },
    orderBy: {
      tag: {
        name: "asc",
      },
    },
  },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

/**
 * Lay product co filter/search/sort/pagination va tra kem tong so ban ghi.
 */
export async function findProducts(options: ProductQueryOptions): Promise<ProductListResult> {
  return withPrismaErrorHandling(findProductsUnchecked(options));
}

/**
 * Lay mot product theo id va map record Prisma sang domain Product.
 */
export async function findProductById(id: number): Promise<Product | null> {
  const product = await withPrismaErrorHandling(
    prisma.product.findUnique({
      where: {
        id,
      },
      include: productInclude,
    }),
  );

  return product ? mapProductRecord(product) : null;
}

/**
 * Tao product va tag relations trong transaction de dam bao du lieu nhat quan.
 */
export async function createProduct(productRequest: ProductRequest): Promise<Product> {
  return withPrismaErrorHandling(
    prisma.$transaction(async (tx) => {
      const categoryId = await findCategoryId(tx, productRequest.category);
      const product = await tx.product.create({
        data: {
          categoryId,
          description: productRequest.description,
          imageUrl: productRequest.imageUrl,
          name: productRequest.name,
          price: productRequest.price,
        },
        select: {
          id: true,
        },
      });

      await replaceProductTags(tx, product.id, productRequest.tags);

      const createdProduct = await tx.product.findUnique({
        where: {
          id: product.id,
        },
        include: productInclude,
      });

      if (!createdProduct) {
        throw new Error("Product was not found after creation.");
      }

      return mapProductRecord(createdProduct);
    }),
  );
}

/**
 * Thay the product va danh sach tag trong transaction; tra null neu product khong ton tai.
 */
export async function replaceProduct(
  id: number,
  productRequest: ProductRequest,
): Promise<Product | null> {
  return withPrismaErrorHandling(
    prisma.$transaction(async (tx) => {
      const existingProduct = await tx.product.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
        },
      });

      if (!existingProduct) {
        return null;
      }

      const categoryId = await findCategoryId(tx, productRequest.category);

      await tx.product.update({
        where: {
          id,
        },
        data: {
          categoryId,
          description: productRequest.description,
          imageUrl: productRequest.imageUrl,
          name: productRequest.name,
          price: productRequest.price,
        },
      });

      await replaceProductTags(tx, id, productRequest.tags);

      const product = await tx.product.findUnique({
        where: {
          id,
        },
        include: productInclude,
      });

      return product ? mapProductRecord(product) : null;
    }),
  );
}

/**
 * Xoa product theo id; deleteMany giu delete idempotent khi product khong ton tai.
 */
export async function deleteProduct(id: number): Promise<void> {
  await withPrismaErrorHandling(
    prisma.product.deleteMany({
      where: {
        id,
      },
    }),
  );
}

/**
 * Query product list va count trong cung transaction Prisma.
 */
async function findProductsUnchecked(options: ProductQueryOptions): Promise<ProductListResult> {
  const where = buildProductWhere(options.filters);
  const sort = options.pageable.sort.first ?? { direction: "asc" as const, property: "id" };
  const orderBy = getProductOrderBy(sort.property, sort.direction);

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: [
        orderBy,
        {
          id: "asc",
        },
      ],
      skip: options.pageable.skip,
      take: options.pageable.take,
    }),
    prisma.product.count({
      where,
    }),
  ]);

  return {
    data: products.map(mapProductRecord),
    total,
  };
}

/**
 * Tim category id tu ten category da validate, nem 400 neu database thieu category.
 */
async function findCategoryId(
  client: Prisma.TransactionClient,
  categoryName: ProductCategory,
): Promise<number> {
  const category = await client.category.findUnique({
    where: {
      name: categoryName,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    throw new BadRequestException("Category not found");
  }

  return category.id;
}

/**
 * Xoa toan bo tag relation cu va gan lai danh sach tag moi cho product.
 */
async function replaceProductTags(
  client: Prisma.TransactionClient,
  productId: number,
  tags: string[],
): Promise<void> {
  await client.productTag.deleteMany({
    where: {
      productId,
    },
  });

  for (const tagName of tags) {
    const tag = await client.tag.upsert({
      where: {
        name: tagName,
      },
      update: {
        name: tagName,
      },
      create: {
        name: tagName,
      },
      select: {
        id: true,
      },
    });

    await client.productTag.upsert({
      where: {
        productId_tagId: {
          productId,
          tagId: tag.id,
        },
      },
      update: {},
      create: {
        productId,
        tagId: tag.id,
      },
    });
  }
}

/**
 * Chuyen Prisma product record sang Product API shape.
 */
function mapProductRecord(product: ProductWithRelations): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toNumber(),
    category: product.category.name,
    tags: product.productTags.map((productTag) => productTag.tag.name),
    imageUrl: product.imageUrl,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

/**
 * Tao Prisma where an toan cho search va cac filter gia/category.
 */
function buildProductWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [];

  if (filters.search) {
    and.push({
      OR: [
        {
          name: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        },
        {
          productTags: {
            some: {
              tag: {
                name: {
                  contains: filters.search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    });
  }

  if (filters.category) {
    and.push({
      category: {
        name: filters.category,
      },
    });
  }

  if (filters.minPrice !== null) {
    and.push({
      price: {
        gte: filters.minPrice,
      },
    });
  }

  if (filters.maxPrice !== null) {
    and.push({
      price: {
        lte: filters.maxPrice,
      },
    });
  }

  return and.length > 0 ? { AND: and } : {};
}

/**
 * Map field sort tu API sang Prisma orderBy whitelist de tranh sort field tuy y.
 */
function getProductOrderBy(
  sort: ProductSortField,
  direction: Prisma.SortOrder,
): Prisma.ProductOrderByWithRelationInput {
  const sortColumns: Record<string, Prisma.ProductOrderByWithRelationInput> = {
    id: {
      id: direction,
    },
    name: {
      name: direction,
    },
    price: {
      price: direction,
    },
    category: {
      category: {
        name: direction,
      },
    },
    createdAt: {
      createdAt: direction,
    },
    updatedAt: {
      updatedAt: direction,
    },
  };

  const orderBy = sortColumns[sort];
  if (!orderBy) {
    throw new BadRequestException("Invalid sort field");
  }

  return orderBy;
}
