import "dotenv/config";

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl,
  }),
});

type SeedProduct = {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  tags: string[];
};

const categories = ["Phone", "Tablet", "Accessory", "Other"];

const tags = [
  "apple",
  "ios",
  "android",
  "flagship",
  "camera",
  "budget",
  "tablet",
  "productivity",
  "stylus",
  "audio",
  "watch",
  "fitness",
  "charger",
  "battery",
  "mouse",
  "office",
  "usb-c",
  "travel",
];

const products: SeedProduct[] = [
  {
    name: "iPhone 16 Pro",
    description: "Premium Apple smartphone with powerful camera and fast performance.",
    price: 1199,
    category: "Phone",
    imageUrl: "https://picsum.photos/seed/iphone-16-pro/800/600",
    tags: ["apple", "ios", "flagship", "camera"],
  },
  {
    name: "Samsung Galaxy S25",
    description: "Flagship Android phone with AMOLED display and high refresh rate.",
    price: 1099,
    category: "Phone",
    imageUrl: "https://picsum.photos/seed/samsung-galaxy-s25/800/600",
    tags: ["android", "flagship"],
  },
  {
    name: "Google Pixel 9",
    description: "Google smartphone focused on clean Android experience and AI camera features.",
    price: 899,
    category: "Phone",
    imageUrl: "https://picsum.photos/seed/google-pixel-9/800/600",
    tags: ["android", "camera"],
  },
  {
    name: "Xiaomi 14T",
    description: "Affordable performance phone with long battery life and fast charging.",
    price: 599,
    category: "Phone",
    imageUrl: "https://picsum.photos/seed/xiaomi-14t/800/600",
    tags: ["android", "budget"],
  },
  {
    name: "iPad Air 6",
    description: "Lightweight tablet for study, design work, entertainment, and productivity.",
    price: 699,
    category: "Tablet",
    imageUrl: "https://picsum.photos/seed/ipad-air-6/800/600",
    tags: ["apple", "tablet", "productivity"],
  },
  {
    name: "Samsung Galaxy Tab S10",
    description: "Android tablet with large display, stylus support, and multitasking features.",
    price: 799,
    category: "Tablet",
    imageUrl: "https://picsum.photos/seed/galaxy-tab-s10/800/600",
    tags: ["android", "tablet", "stylus"],
  },
  {
    name: "Lenovo Tab Plus",
    description: "Portable tablet for watching movies, browsing, reading, and online learning.",
    price: 329,
    category: "Tablet",
    imageUrl: "https://picsum.photos/seed/lenovo-tab-plus/800/600",
    tags: ["tablet", "budget"],
  },
  {
    name: "AirPods Pro 2",
    description: "Wireless noise cancelling earbuds with spatial audio and compact charging case.",
    price: 249,
    category: "Accessory",
    imageUrl: "https://picsum.photos/seed/airpods-pro-2/800/600",
    tags: ["apple", "audio"],
  },
  {
    name: "Galaxy Watch 7",
    description: "Smartwatch for fitness tracking, notifications, health monitoring, and daily use.",
    price: 299,
    category: "Accessory",
    imageUrl: "https://picsum.photos/seed/galaxy-watch-7/800/600",
    tags: ["watch", "fitness"],
  },
  {
    name: "Anker PowerCore 20000",
    description: "High capacity portable power bank for phones, tablets, and travel charging.",
    price: 69,
    category: "Accessory",
    imageUrl: "https://picsum.photos/seed/anker-powercore-20000/800/600",
    tags: ["charger", "battery", "travel"],
  },
  {
    name: "Logitech MX Master 3S",
    description: "Wireless productivity mouse with ergonomic design and precise scrolling.",
    price: 99,
    category: "Accessory",
    imageUrl: "https://picsum.photos/seed/logitech-mx-master-3s/800/600",
    tags: ["mouse", "productivity", "office"],
  },
  {
    name: "USB-C Travel Hub",
    description: "Compact USB-C hub with HDMI, USB ports, and card reader for daily work.",
    price: 45,
    category: "Other",
    imageUrl: "https://picsum.photos/seed/usb-c-travel-hub/800/600",
    tags: ["usb-c", "office", "travel"],
  },
];

async function main(): Promise<void> {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const customerPassword = await bcrypt.hash("customer123", 10);

  await prisma.user.upsert({
    where: {
      username: "admin",
    },
    update: {
      email: "admin@example.com",
      passwordHash: adminPassword,
      role: "admin",
    },
    create: {
      email: "admin@example.com",
      username: "admin",
      passwordHash: adminPassword,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: {
      username: "customer",
    },
    update: {
      email: "customer@example.com",
      passwordHash: customerPassword,
      role: "customer",
    },
    create: {
      email: "customer@example.com",
      username: "customer",
      passwordHash: customerPassword,
      role: "customer",
    },
  });

  for (const categoryName of categories) {
    await prisma.category.upsert({
      where: {
        name: categoryName,
      },
      update: {},
      create: {
        name: categoryName,
      },
    });
  }

  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: {
        name: tagName,
      },
      update: {},
      create: {
        name: tagName,
      },
    });
  }

  for (const product of products) {
    await upsertProduct(product);
  }
}

async function upsertProduct(product: SeedProduct): Promise<void> {
  const category = await prisma.category.findUnique({
    where: {
      name: product.category,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    throw new Error(`Category not found while seeding: ${product.category}`);
  }

  const existingProduct = await prisma.product.findFirst({
    where: {
      name: product.name,
    },
    select: {
      id: true,
    },
  });

  const savedProduct = existingProduct
    ? await prisma.product.update({
        where: {
          id: existingProduct.id,
        },
        data: {
          categoryId: category.id,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
        },
        select: {
          id: true,
        },
      })
    : await prisma.product.create({
        data: {
          categoryId: category.id,
          description: product.description,
          imageUrl: product.imageUrl,
          name: product.name,
          price: product.price,
        },
        select: {
          id: true,
        },
      });

  await prisma.productTag.deleteMany({
    where: {
      productId: savedProduct.id,
    },
  });

  for (const tagName of product.tags) {
    const tag = await prisma.tag.upsert({
      where: {
        name: tagName,
      },
      update: {},
      create: {
        name: tagName,
      },
      select: {
        id: true,
      },
    });

    await prisma.productTag.upsert({
      where: {
        productId_tagId: {
          productId: savedProduct.id,
          tagId: tag.id,
        },
      },
      update: {},
      create: {
        productId: savedProduct.id,
        tagId: tag.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
