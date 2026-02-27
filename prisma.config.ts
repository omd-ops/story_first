import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DIRECT_URL) {
  throw new Error("DIRECT_URL environment variable not set");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL,
  },
});