import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

function createPrismaClient() {
  // Build an absolute path and convert backslashes for the libsql file URL
  const dbAbsPath = process.env.DATABASE_PATH
    ? process.env.DATABASE_PATH
    : path.join(process.cwd(), "dev.db").replace(/\\/g, "/");

  const adapter = new PrismaLibSql({
    url: `file:${dbAbsPath}`,
  });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
