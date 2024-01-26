import { RedisClientType, createClient } from "redis";

let connection: RedisClientType | null = null;
export const getConnection = async () => {
  if (connection) return connection;
  connection = (await createClient({
    url: process.env.REDISURL || "redis://localhost:6379",
  })
    .on("error", (error) => {
      console.error("Redis connection error", error);
    })
    .on("connect", () => {
      console.log("Redis client connected");
    })
    .connect()) as RedisClientType;

  return connection;
};

export const closeConnection = async () => {
  if (connection) {
    connection.disconnect();
    connection = null;
  }
};

export const isRequestAllowed = async (
  userId: string,
  requestKey: string,
  maxRequests: number,
  intervalInMs: number
) => {
  let connection = await getConnection();
  let windowStartString = await connection.get(`${userId}-${requestKey}-time`);
  let windowStart = windowStartString ? parseFloat(windowStartString) : 0;
  let now = Date.now();

  if (now - windowStart > intervalInMs) {
    await connection
      .multi()
      .set(`${userId}-${requestKey}-time`, now)
      .set(`${userId}-${requestKey}-count`, maxRequests - 1)
      .exec();
    return true;
  } else {
    let countString = await connection.get(`${userId}-${requestKey}-count`);
    let count = countString ? parseInt(countString) : 0;
    if (count === 0) {
      return false;
    } else {
      await connection.decr(`${userId}-${requestKey}-count`);
      return true;
    }
  }
};
