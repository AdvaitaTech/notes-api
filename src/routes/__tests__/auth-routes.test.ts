import app from "app";
import { db } from "config/db";
import { Users } from "config/schema";
import request from "supertest";

const validationMessage =
  "Invalid data. Required fields are name, email, password and confirm.";
const loginValidationMessage =
  "Invalid data. Required fields are email and password.";
describe("Auth Routes", () => {
  beforeAll(async () => {
    await db.delete(Users);
  });

  describe("POST /auth/register", () => {
    it("should show data error if all information is not provided", async () => {
      let res = await request(app).post("/auth/register").send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(validationMessage);
      res = await request(app)
        .post("/auth/register")
        .send({ name: "test", email: "", password: "test" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(validationMessage);
      res = await request(app)
        .post("/auth/register")
        .send({ name: "test", email: "" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(validationMessage);
    });

    it("should have a minimum password length of 6 characters", async () => {
      let res = await request(app).post("/auth/register").send({
        name: "test",
        email: "test0@example.com",
        password: "test",
        confirm: "test",
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(
        "Invalid password length. Must be at least 6 characters."
      );
    });

    it("should register user", async () => {
      const res = await request(app).post("/auth/register").send({
        name: "test",
        email: "test1@example.com",
        password: "testing",
        confirm: "testing",
      });
      expect(res.status).toBe(200);
    });

    it("should show error for duplicate email", async () => {
      const res = await request(app).post("/auth/register").send({
        name: "test",
        email: "test1@example.com",
        password: "testing",
        confirm: "testing",
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Email already exists");
    });
  });

  describe("POST /auth/login", () => {
    it("should show data error if all information is not provided", async () => {
      let res = await request(app).post("/auth/login").send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(loginValidationMessage);
      res = await request(app).post("/auth/login").send({ email: "" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(loginValidationMessage);
    });

    it("should login user", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "test1@example.com",
        password: "testing",
      });
      expect(res.status).toBe(200);
    });

    it("should login user", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "test1@example.com",
        password: "testing",
      });
      expect(res.status).toBe(200);
      expect(res.body.token).not.toBeNull();
      expect(res.body.token).not.toBeUndefined();
    });
  });
});
