import { connection, db } from "config/db";
import { Users, Notes } from "config/schema";
import { eq } from "drizzle-orm";
import { createUser, loginUser } from "models/users";

describe("User Model", () => {
  afterAll(async () => {
    await connection.end();
  });
  it("should create user", async () => {
    const user = await createUser({
      name: "John Doe",
      email: "test1@email.com",
      password: "testing",
    });
    expect(user.id).toBeGreaterThan(0);
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("test1@email.com");
  });

  it("should not store password in plain text", async () => {
    await createUser({
      name: "John Doe",
      email: "test2@email.com",
      password: "testing",
    });
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.email, "test2@email.com"));
    expect(user[0].password).not.toBe("testing");
  });

  it("should not allow duplicate email", async () => {
    await createUser({
      name: "John Doe",
      email: "test3@email.com",
      password: "testing",
    });
    await expect(
      createUser({
        name: "John Doe",
        email: "test3@email.com",
        password: "password3",
      })
    ).rejects.toThrow();
  });

  it("should login user", async () => {
    await createUser({
      name: "John Doe",
      email: "test4@email.com",
      password: "testing",
    });
    const user = await loginUser({
      email: "test4@email.com",
      password: "testing",
    });
    expect(user.email).toBe("test4@email.com");
  });

  it("should fail login", async () => {
    await createUser({
      name: "John Doe",
      email: "test5@email.com",
      password: "testing",
    });
    await expect(
      loginUser({
        email: "test5@email.com",
        password: "wrongpass",
      })
    ).rejects.toThrow();
  });
});
