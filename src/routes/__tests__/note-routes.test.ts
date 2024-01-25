import app from "app";
import { connection, db } from "config/db";
import { Notes, Users } from "config/schema";
import { createUser } from "models/users";
import request from "supertest";

describe("Note Routes", () => {
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
      expect(res.body.id).toBeGreaterThan(0);
      expect(res.body.title).toBe("Note 1");
    });
  });

  describe("GET /notes/", () => {
    // creating a separate user so that testing
    // number of notes is easier
    beforeAll(async () => {
      await createUser({
        name: "noteTest",
        email: "notes2@example.com",
        password: "testing",
      });
      const res = await request(app).post("/auth/login").send({
        email: "notes2@example.com",
        password: "testing",
      });
      if (!res.body || !res.body.token) return;
      token = res.body.token;
    });

    it("should throw auth error if no token provided", async () => {
      const res = await request(app).get("/notes/");
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid authorization token.");
    });

    it("show empty notes if none are created", async () => {
      const res = await request(app)
        .get("/notes/")
        .set("Authorization", "Bearer " + token);
      expect(res.status).toBe(200);
      expect(res.body.notes).toHaveLength(0);
    });

    it("should show all notes for user", async () => {
      let noteCount = 5;
      for (let i = 0; i < noteCount; i++) {
        await request(app)
          .post("/notes/")
          .set("Authorization", "Bearer " + token)
          .send({
            title: "Custom Note " + i,
            body: "This is a test note",
            tags: ["test", "note"],
          });
      }
      let res = await request(app)
        .get("/notes/")
        .set("Authorization", "Bearer " + token);
      expect(res.status).toBe(200);
      expect(res.body.notes).toHaveLength(noteCount);
      for (let i = 0; i < noteCount; i++) {
        expect(res.body.notes[i].title).toBe("Custom Note " + i);
      }
    });
  });

  describe("GET /notes/:id", () => {
    let noteId: number = 0;
    // creating a separate user so that testing
    // number of notes is easier
    beforeAll(async () => {
      await createUser({
        name: "noteTest",
        email: "notes3@example.com",
        password: "testing",
      });
      let res = await request(app).post("/auth/login").send({
        email: "notes3@example.com",
        password: "testing",
      });
      if (!res.body || !res.body.token) return;
      token = res.body.token;
      res = await request(app)
        .post("/notes/")
        .set("Authorization", "Bearer " + token)
        .send({
          title: "Testing GET Note",
          body: "This is a test note",
          tags: ["test", "note"],
        });
      noteId = res.body.id;
    });

    it("should throw auth error if no token provided", async () => {
      const res = await request(app).get(`/notes/${noteId}`);
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid authorization token.");
    });

    it("show give error if wrong id", async () => {
      const res = await request(app)
        .get(`/notes/${5555555}`)
        .set("Authorization", "Bearer " + token);
      expect(res.status).toBe(404);
    });

    it("should get valid note back", async () => {
      const res = await request(app)
        .get(`/notes/${noteId}`)
        .set("Authorization", "Bearer " + token);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(noteId);
      expect(res.body.title).toBe("Testing GET Note");
    });
  });

  describe("PUT /notes/:id", () => {
    let noteId: number = 0;
    // creating a separate user so that testing
    // number of notes is easier
    beforeAll(async () => {
      await createUser({
        name: "noteTest",
        email: "notes4@example.com",
        password: "testing",
      });
      let res = await request(app).post("/auth/login").send({
        email: "notes4@example.com",
        password: "testing",
      });
      if (!res.body || !res.body.token) return;
      token = res.body.token;
      res = await request(app)
        .post("/notes/")
        .set("Authorization", "Bearer " + token)
        .send({
          title: "Testing PUT Note",
          body: "This is a test note",
          tags: ["test", "note"],
        });
      noteId = res.body.id;
    });

    it("should throw auth error if no token provided", async () => {
      const res = await request(app).put(`/notes/${noteId}`).send({});
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid authorization token.");
    });

    it("show give error if wrong id", async () => {
      const res = await request(app)
        .put(`/notes/${5555555}`)
        .set("Authorization", "Bearer " + token)
        .send({ title: "Changed title" });
      expect(res.status).toBe(404);
    });

    it("should update note", async () => {
      let res = await request(app)
        .put(`/notes/${noteId}`)
        .set("Authorization", "Bearer " + token)
        .send({ title: "Changed title" });
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(noteId);
      expect(res.body.title).toBe("Changed title");
      res = await request(app)
        .put(`/notes/${noteId}`)
        .set("Authorization", "Bearer " + token)
        .send({ body: "Changed body", tags: ["daily"] });
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(noteId);
      expect(res.body.body).toBe("Changed body");
      expect(res.body.tags).toHaveLength(1);
      expect(res.body.tags[0]).toBe("daily");
    });
  });

  describe("DELETE /notes/:id", () => {
    let noteId: number = 0;
    // creating a separate user so that testing
    // number of notes is easier
    beforeAll(async () => {
      await createUser({
        name: "noteTest",
        email: "notes5@example.com",
        password: "testing",
      });
      let res = await request(app).post("/auth/login").send({
        email: "notes5@example.com",
        password: "testing",
      });
      if (!res.body || !res.body.token) return;
      token = res.body.token;
      res = await request(app)
        .post("/notes/")
        .set("Authorization", "Bearer " + token)
        .send({
          title: "Testing DELETE Note",
          body: "This is a test note",
          tags: ["test", "note"],
        });
      noteId = res.body.id;
    });

    it("should throw auth error if no token provided", async () => {
      const res = await request(app).delete(`/notes/${noteId}`);
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid authorization token.");
    });

    it("show give error if wrong id", async () => {
      const res = await request(app)
        .delete(`/notes/${5555555}`)
        .set("Authorization", "Bearer " + token);
      expect(res.status).toBe(404);
    });

    it("should delete note", async () => {
      let res = await request(app)
        .delete(`/notes/${noteId}`)
        .set("Authorization", "Bearer " + token);
      expect(res.status).toBe(200);
      res = await request(app)
        .get(`/notes/${noteId}`)
        .set("Authorization", "Bearer " + token);
      expect(res.status).toBe(404);
    });
  });
});
