import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_PALI_DB_URL!,
    authToken: process.env.TURSO_PALI_DB_TOKEN!,
  },
});
