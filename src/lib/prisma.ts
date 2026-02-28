// ensure .env variables are loaded before anything else touches them
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client/index";

// Prisma may fail to initialize if DATABASE_URL (or whichever datasource is
// configured) is absent.  The original constructor throws during import,
// which caused serverless routes to crash even when we only wanted to run
// the upload logic.  We handle the error here and export a stub instead so
// the rest of the app can continue working; callers should guard against
// the client being unavailable.

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined");
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (err: any) {
    console.warn("PrismaClient initialization failed:", err.message || err);
    console.warn("DATABASE_URL=>", process.env.DATABASE_URL);
    // return a proxy that throws on actual data access but allows module evaluation
    return new Proxy(
      {},
      {
        get(_, prop) {
          if (prop === "__isProxyStub") return true;
          if (typeof prop === "symbol") return undefined;
          if (["then", "toJSON", "$$typeof", "__esModule"].includes(prop as string)) return undefined;

          throw new Error("PrismaClient not available (check DATABASE_URL)");
        },
      },
    ) as unknown as PrismaClient;
  }
}

let prismaClient = globalForPrisma.prisma;
if (!prismaClient || (prismaClient as any).__isProxyStub) {
  prismaClient = createClient();
}

export const prisma: PrismaClient = prismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
