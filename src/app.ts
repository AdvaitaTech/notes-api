import Express from "express";
import dotenvFlow from "dotenv-flow";
import AuthRoutes from "routes/auth-routes";
import NoteRoutes from "routes/note-routes";
import bodyParser from "body-parser";

dotenvFlow.config();
const app = Express();

app.use(bodyParser.json());
app.use("/auth", AuthRoutes);
app.use("/notes", NoteRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
