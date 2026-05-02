import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PRODUCTS } from "../src/lib/products";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("🌱 Seeding MediCart database...\n");

  // ── Products ─────────────────────────────────────────────────────────────
  let seeded = 0;
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        brand: p.brand,
        genericName: p.genericName ?? null,
        category: p.category,
        subcategory: p.subcategory,
        form: p.form,
        strength: p.strength ?? null,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        rating: p.rating,
        reviews: p.reviews,
        stock: p.stock,
        image: p.image,
        color: p.color,
        bgColor: p.bgColor,
        tags: p.tags,
        description: p.description,
        uses: p.uses,
        sideEffects: p.sideEffects ?? [],
        prescription: p.prescription,
        isNew: p.isNew,
        isBestSeller: p.isBestSeller,
        isTrending: p.isTrending,
        inStock: p.inStock,
        packSize: p.packSize,
        manufacturer: p.manufacturer,
        expiryMonths: p.expiryMonths,
        sku: p.sku,
      },
    });
    seeded++;
    if (seeded % 10 === 0) process.stdout.write(`\r   Products: ${seeded}/${PRODUCTS.length}`);
  }
  console.log(`\r✅ Seeded ${seeded} products       `);

  // ── Admin user ────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@medicart.com" },
    update: {},
    create: {
      email: "admin@medicart.com",
      name: "MediCart Admin",
      passwordHash: adminHash,
      isAdmin: true,
      mediCoins: 0,
      tier: "PLATINUM",
    },
  });
  console.log(`✅ Admin:  ${admin.email}`);

  // ── Demo user ─────────────────────────────────────────────────────────────
  const demoHash = await bcrypt.hash("demo123", 10);
  const demo = await prisma.user.upsert({
    where: { email: "demo@medicart.com" },
    update: {},
    create: {
      email: "demo@medicart.com",
      name: "Alex Johnson",
      passwordHash: demoHash,
      phone: "+1 555-0192",
      mediCoins: 1240,
      memberSince: new Date("2024-01-15"),
      tier: "GOLD",
      isAdmin: false,
      addresses: {
        create: [
          {
            label: "Home",
            line1: "742 Evergreen Terrace",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            isDefault: true,
          },
          {
            label: "Work",
            line1: "1000 Industrial Blvd",
            line2: "Suite 400",
            city: "Springfield",
            state: "IL",
            zip: "62702",
            isDefault: false,
          },
        ],
      },
    },
  });
  console.log(`✅ Demo:   ${demo.email}`);

  console.log("\n🎉 Database seeding complete!");
  console.log("   Admin:  admin@medicart.com / admin123");
  console.log("   Demo:   demo@medicart.com  / demo123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
