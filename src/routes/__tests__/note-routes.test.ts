import app from "app";
import { connection, db } from "config/db";
import { Notes, Users } from "config/schema";
import { createUser } from "models/users";
import request from "supertest";

describe("Auth Routes", () => {
  let token: string = "";
  beforeAll(async () => {
    await db.delete(Users);
    await db.delete(Notes);
    await createUser({
      name: "noteTest",
      email: "notes@example.com",
      password: "testing",
    });
    const res = await request(app).post("/auth/login").send({
      email: "notes@example.com",
      password: "testing",
    });
    if (!res.body || !res.body.token) return;
    token = res.body.token;
  });
  afterAll(async () => {
    await connection.end();
  });

  describe("POST /notes/", () => {
    const validationMessage =
      "Invalid data. Required fields are title(string), body(string), and tags(array).";

    it("should throw auth error if no token provided", async () => {
      const res = await request(app)
        .post("/notes/")
        .send({
          title: "Note 1",
          body: "This is a test note",
          tags: ["test", "note"],
        });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid authorization token.");
    });

    it("should show data error if all information is not provided", async () => {
      let res = await request(app)
        .post("/notes/")
        .set("Authorization", "Bearer " + token)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(validationMessage);
      res = await request(app)
        .post("/notes/")
        .set("Authorization", "Bearer " + token)
        .send({ title: "test" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(validationMessage);
      res = await request(app)
        .post("/notes/")
        .set("Authorization", "Bearer " + token)
        .send({ name: "test", body: "" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(validationMessage);
    });

    it("should create a note", async () => {
      const res = await request(app)
        .post("/notes/")
        .set("Authorization", "Bearer " + token)
        .send({
          title: "Note 1",
          body: "This is a test note",
          tags: ["test", "note"],
        });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Note 1");
    });
  });
});
