import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  // During `next build` worker processes, DATABASE_URL may not be injected.
  // Use a placeholder so the module can be imported without throwing.
  // Any actual DB query will fail gracefully at that point (none are made during build).
  const connectionString =
    process.env.DATABASE_URL ?? "postgresql://build:build@localhost/build";
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
