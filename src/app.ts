import Express from "express";
import dotenvFlow from "dotenv-flow";

dotenvFlow.config();
const app = Express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
