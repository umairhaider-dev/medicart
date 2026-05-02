import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Prisma CLI doesn't load .env.local automatically (Next.js convention)
config({ path: ".env.local" });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
