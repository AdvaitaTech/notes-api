import { pgTable, text, serial, varchar, integer } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }),
  email: varchar("email", { length: 200 }).unique().notNull(),
  password: varchar("password", { length: 200 }).notNull(),
});

export const Notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: varchar("name", { length: 300 }),
  body: text("body"),
  userId: integer("user_id")
    .references(() => Users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  tags: varchar("tags", { length: 300 }).array(),
});
