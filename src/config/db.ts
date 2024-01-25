import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export const connection = new Pool({
  host: process.env.DBHOST || "127.0.0.1",
  port: Number(process.env.DBPORT) || 5432,
  user: process.env.DBUSER || "postgres",
  password: process.env.DBPASSWORD || "password",
  database: process.env.DBNAME || "notes_dev",
});

export const db = drizzle(connection, { schema });
