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

const productImages = {
  airPodsPro2: "https://www.apple.com/v/airpods-pro/r/images/meta/og__c0ceegchesom_overview.png?202605181458",
  ankerPrimePowerBank: "https://cdn.shopify.com/s/files/1/0493/9834/9974/files/A1383011-F0_A1383H11_Product_Image.png?v=1773225296",
  appleWatchSeries10: "https://www.apple.com/assets-www/en_WW/watch/og/watch_og_1ff2ee953.png",
  belkinUsbCHub: "https://www.belkin.com/dw/image/v2/BGBH_PRD/on/demandware.static/-/Sites-master-product-catalog-blk/default/dwd3408708/images/hi-res/8/40d9a03979a9a04f_AVC006btSGY_USB-C_4in1_MultiportAdapter_Hero2_WEB_1.jpg?sw=700&sh=700&sm=fit&sfrm=png",
  galaxyTabS10Plus: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-tab-s10-plus-1.jpg",
  galaxyWatch7: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-watch7-1.jpg",
  googlePixel9: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-1.jpg",
  ipadAir13: "https://fdn2.gsmarena.com/vv/pics/apple/apple-ipad-air-13-2024-2.jpg",
  iphone16Pro: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-1.jpg",
  keychronK2: "https://www.keychron.com/cdn/shop/products/Keychron-K2-wireless-mechanical-keyboard-for-Mac-Windows-iOS-Gateron-switch-red-with-type-C-RGB-white-backlight-exclusive-color.jpg?crop=center&height=1200&v=1650445595&width=1200",
  kindlePaperwhite: "https://m.media-amazon.com/images/I/415YFn0VOzL.jpg",
  lenovoTabPlus: "https://fdn2.gsmarena.com/vv/pics/lenovo/lenovo-tab-plus-1.jpg",
  logitechMxMaster3s: "https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/2025-update/mx-master-3s-bluetooth-edition-top-view-black-new-1.png",
  samsungGalaxyS25: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-sm-s931-1.jpg",
  xiaomiPad7Pro: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-pad-7-pro-1.jpg",
  xiaomi14T: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14t-1.jpg",
} as const;

const categories = ["Phone", "Tablet", "Accessory", "Other"];

const tags = [
  "apple",
  "ios",
  "android",
  "flagship",
  "camera",
  "budget",
  "fast-charging",
  "tablet",
  "productivity",
  "stylus",
  "audio",
  "watch",
  "fitness",
  "charger",
  "battery",
  "mouse",
  "keyboard",
  "usb-c",
  "reading",
];

const products: SeedProduct[] = [
  {
    name: "iPhone 16 Pro",
    description: "Premium Apple smartphone with powerful camera and fast performance.",
    price: 29990000,
    category: "Phone",
    imageUrl: productImages.iphone16Pro,
    tags: ["apple", "ios", "flagship", "camera"],
  },
  {
    name: "Samsung Galaxy S25",
    description: "Flagship Android phone with AMOLED display and high refresh rate.",
    price: 22990000,
    category: "Phone",
    imageUrl: productImages.samsungGalaxyS25,
    tags: ["android", "flagship"],
  },
  {
    name: "Google Pixel 9",
    description: "Google smartphone focused on clean Android experience and AI camera features.",
    price: 18990000,
    category: "Phone",
    imageUrl: productImages.googlePixel9,
    tags: ["android", "camera"],
  },
  {
    name: "Xiaomi 14T",
    description: "Affordable performance phone with long battery life and fast charging.",
    price: 12990000,
    category: "Phone",
    imageUrl: productImages.xiaomi14T,
    tags: ["android", "budget"],
  },
  {
    name: "iPad Air 13",
    description: "Large and lightweight Apple tablet for study, sketching, and entertainment.",
    price: 21990000,
    category: "Tablet",
    imageUrl: productImages.ipadAir13,
    tags: ["apple", "tablet", "productivity"],
  },
  {
    name: "Samsung Galaxy Tab S10+",
    description: "Premium Android tablet with large AMOLED display and stylus support.",
    price: 27990000,
    category: "Tablet",
    imageUrl: productImages.galaxyTabS10Plus,
    tags: ["android", "tablet", "stylus", "productivity"],
  },
  {
    name: "Lenovo Tab Plus",
    description: "Portable Android tablet for movies, reading, online classes, and browsing.",
    price: 7990000,
    category: "Tablet",
    imageUrl: productImages.lenovoTabPlus,
    tags: ["android", "tablet", "budget"],
  },
  {
    name: "Xiaomi Pad 7 Pro",
    description: "Fast Android tablet with sharp display, strong performance, and slim design.",
    price: 11990000,
    category: "Tablet",
    imageUrl: productImages.xiaomiPad7Pro,
    tags: ["android", "tablet", "productivity"],
  },
  {
    name: "AirPods Pro 2",
    description: "Wireless earbuds with active noise cancellation and spatial audio.",
    price: 5990000,
    category: "Accessory",
    imageUrl: productImages.airPodsPro2,
    tags: ["apple", "audio"],
  },
  {
    name: "Galaxy Watch 7",
    description: "Smartwatch for health tracking, workouts, notifications, and daily use.",
    price: 6990000,
    category: "Accessory",
    imageUrl: productImages.galaxyWatch7,
    tags: ["watch", "fitness", "android"],
  },
  {
    name: "Apple Watch Series 10",
    description: "Apple smartwatch with fitness tracking, notifications, and health features.",
    price: 10990000,
    category: "Accessory",
    imageUrl: productImages.appleWatchSeries10,
    tags: ["apple", "watch", "fitness"],
  },
  {
    name: "Anker Prime Power Bank",
    description: "High capacity portable charger for phones, tablets, and travel days.",
    price: 2990000,
    category: "Accessory",
    imageUrl: productImages.ankerPrimePowerBank,
    tags: ["charger", "battery", "usb-c", "fast-charging"],
  },
  {
    name: "Logitech MX Master 3S",
    description: "Wireless productivity mouse with ergonomic design and precise scrolling.",
    price: 2490000,
    category: "Other",
    imageUrl: productImages.logitechMxMaster3s,
    tags: ["mouse", "productivity"],
  },
  {
    name: "Keychron K2 Keyboard",
    description: "Compact wireless mechanical keyboard for work desks and multi-device setups.",
    price: 2190000,
    category: "Other",
    imageUrl: productImages.keychronK2,
    tags: ["keyboard", "productivity"],
  },
  {
    name: "Belkin USB-C Hub",
    description: "Compact USB-C multiport adapter with HDMI, USB ports, and power pass-through.",
    price: 1190000,
    category: "Other",
    imageUrl: productImages.belkinUsbCHub,
    tags: ["usb-c", "productivity"],
  },
  {
    name: "Kindle Paperwhite",
    description: "Waterproof e-reader with crisp display, warm light, and long battery life.",
    price: 3990000,
    category: "Other",
    imageUrl: productImages.kindlePaperwhite,
    tags: ["reading", "battery"],
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

  await deleteProductsOutsideSeed();
  await deleteUnusedTags();
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

async function deleteProductsOutsideSeed(): Promise<void> {
  await prisma.product.deleteMany({
    where: {
      name: {
        notIn: products.map((product) => product.name),
      },
    },
  });
}

async function deleteUnusedTags(): Promise<void> {
  await prisma.tag.deleteMany({
    where: {
      name: {
        notIn: tags,
      },
      productTags: {
        none: {},
      },
    },
  });
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
