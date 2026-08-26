import { PrismaClient } from "@prisma/client";

// Prevent multiple Prisma Client instances across serverless executions
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

globalForPrisma.prisma = prisma;
