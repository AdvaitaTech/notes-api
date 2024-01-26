import { getRedisConnection, isRequestAllowed } from "rate-limiter/limiter";

describe("Rate Limiter", () => {
  afterAll(async () => {
    let connection = await getRedisConnection();
    await connection.disconnect();
  });

  it("should connect to redis", async () => {
    await expect(getRedisConnection()).resolves.toBeTruthy();
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
