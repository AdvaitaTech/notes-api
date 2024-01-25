import Express from "express";
import dotenvFlow from "dotenv-flow";
import AuthRoutes from "routes/auth";
import bodyParser from "body-parser";
import http from "http";
import { loadModels } from "models/db";

dotenvFlow.config();
const app = Express();

app.use(bodyParser.json());
app.use("/auth", AuthRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen = function (...args) {
  const server = http.createServer(this);
  loadModels()
    .then(() => {
      return server.listen.apply(server, args);
    })
    .catch((err) => {
      console.error("Error loading models: ", err);
    });
};

export default app;
