import { connection, db } from "./config/db";
import { Notes, Users } from "./config/schema";

const runTestSetup = async () => {
  await db.delete(Notes);
  await db.delete(Users);
  await connection.end();

  process.exit(0);
};
runTestSetup();
