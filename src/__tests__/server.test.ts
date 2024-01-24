import request from "supertest";
import app from "app";

describe("Server", () => {
  it("should run", async () => {
    const res = await request(app).get("/");
    expect(res.status).toEqual(200);
    expect(res.text).toEqual("Hello World!");
  });
});
