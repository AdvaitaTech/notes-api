import dotenvFlow from "dotenv-flow";
import { migrate } from "drizzle-orm/node-postgres/migrator";
dotenvFlow.config();
import { db, connection } from "./db";

console.log(
  "processs env",
  process.env.DBHOST,
  process.env.DBUSER,
  process.env.DBPASSWORD,
  process.env.DBNAME
);

migrate(db, { migrationsFolder: "./drizzle" })
  .then(() => {
    return connection.end();
  })
  .catch((err) => {
    console.error("Error running migrations", err);
  });
