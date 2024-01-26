import { getConnection, isRequestAllowed } from "rate-limiter/limiter";

describe("Rate Limiter", () => {
  afterAll(async () => {
    let connection = await getConnection();
    await connection.disconnect();
  });

  it("should connect to redis", async () => {
    await expect(getConnection()).resolves.toBeTruthy();
  });

  it("should allow 5 requests in 1 second", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await isRequestAllowed("test", "test", 5, 1000);
      expect(res).toBeTruthy();
    }
    const res = await isRequestAllowed("test", "test", 5, 1000);
    expect(res).toBeFalsy();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    let after = await isRequestAllowed("test", "test", 5, 1000);
    expect(after).toBeTruthy();
  });
});
