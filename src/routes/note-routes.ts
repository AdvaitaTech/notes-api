import { Router } from "express";
import { z } from "zod";
import { RouteError, BadDataError } from "./route-errors";
import { tokenMiddleware } from "middleware";

const router = Router();
// All note routes need auth
router.use(tokenMiddleware);

router.post("/", async (req, res) => {
  res.send({});
});

router.get("/", async (req, res) => {
  res.send({});
});

router.get("/:id", async (req, res) => {
  res.send({});
});

router.put("/:id", async (req, res) => {
  res.send({});
});

router.delete("/:id", async (req, res) => {
  res.send({});
});

export default router;
