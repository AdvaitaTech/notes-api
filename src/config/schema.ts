import { pgTable, integer, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }),
  email: varchar("email", { length: 200 }).unique().notNull(),
  password: varchar("password", { length: 200 }).notNull(),
});
