import { db } from "config/db";
import { Users } from "config/schema";
import { eq } from "drizzle-orm";
import { createUser, loginUser } from "models/users";

describe("User Model", () => {
  beforeAll(async () => {
    await db.delete(Users);
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
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.email, "test1@email.com"));
    expect(user[0].password).not.toBe("testing");
  });

  it("should not allow duplicate email", async () => {
    await expect(
      createUser({
        name: "John Doe",
        email: "test1@email.com",
        password: "pass3",
      })
    ).rejects.toThrow();
  });

  it("should login user", async () => {
    const user = await loginUser({
      email: "test1@email.com",
      password: "testing",
    });
    expect(user.email).toBe("test1@email.com");
  });

  it("should fail login", async () => {
    await expect(
      loginUser({
        email: "test1@email.com",
        password: "wrongpass",
      })
    ).rejects.toThrow();
  });
});
