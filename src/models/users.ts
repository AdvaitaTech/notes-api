import bcrypt from "bcrypt";
import { db } from "config/db";
import { users } from "config/schema";
import { BadDataError } from "routes/route-errors";

export const createUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    let hashedPassword = await bcrypt.hash(password, 10);
    const user = await db
      .insert(users)
      .values({ name, email, password: hashedPassword })
      .returning({ id: users.id, name: users.name, email: users.email });
    return user[0];
  } catch (err) {
    throw new BadDataError("Email already exists");
  }
};
