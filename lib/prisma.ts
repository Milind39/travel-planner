// lib/prisma.ts
import { PrismaClient } from "../app/generated/prisma"; // matches your custom output path

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


const db = new PrismaClient();

export { db };
