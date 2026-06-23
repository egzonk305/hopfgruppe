import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if (process.env.VERCEL === "1") {
    throw new Error("DATABASE_URL muss fuer Turso/Vercel gesetzt sein.");
  }

  return "file:./prisma/dev.db";
}

const datasourceUrl = getDatabaseUrl();
const adapter = new PrismaLibSql({
  url: datasourceUrl,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
