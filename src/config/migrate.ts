import dotenvFlow from "dotenv-flow";
import { migrate } from "drizzle-orm/node-postgres/migrator";
dotenvFlow.config();
import { db, connection } from "./db";

migrate(db, { migrationsFolder: "./drizzle" })
  .then(() => {
    return connection.end();
  })
  .catch((err) => {
    console.error("Error running migrations", err);
  });
