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
    const user = await db
      .insert(users)
      .values({ name, email, password })
      .returning({ id: users.id, name: users.name, email: users.email });
    return user[0];
  } catch (err) {
    throw new BadDataError("Email already exists");
  }
};
