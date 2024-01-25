import dotenvFlow from "dotenv-flow";
import type { Config } from "drizzle-kit";

dotenvFlow.config();

export default {
  schema: "./src/config/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "notes_dev",
  },
} satisfies Config;
