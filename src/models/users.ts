import bcrypt from "bcrypt";
import { db } from "config/db";
import { Users } from "config/schema";
import { eq } from "drizzle-orm";
import { AuthError, BadDataError } from "routes/route-errors";

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
      .insert(Users)
      .values({ name, email, password: hashedPassword })
      .returning({ id: Users.id, name: Users.name, email: Users.email });
    return user[0];
  } catch (err) {
    throw new BadDataError("Email already exists");
  }
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await db.select().from(Users).where(eq(Users.email, email));
  if (!user[0]) throw new AuthError("Invalid credentials");
  const success = await bcrypt.compare(password, user[0].password);
  if (success) {
    return {
      id: user[0].id,
      email: user[0].email,
    };
  } else throw new AuthError("Invalid credentials");
};
