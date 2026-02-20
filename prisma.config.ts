import path from "node:path";
import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: path.join("src", "components", "db", "schema.prisma"),
  datasource: {
    url: process.env.DIRECT_URL!,
  },
});
