import { Router } from "express";
import { z } from "zod";
import { RouteError, BadDataError, TokenError } from "./route-errors";
import { tokenMiddleware } from "middleware";
import { db } from "config/db";
import { Notes } from "config/schema";
import { eq } from "drizzle-orm";

const router = Router();
// All note routes need auth
router.use(tokenMiddleware);

const localsSchema = z.object({
  userId: z.number(),
});

const createNoteSchema = z.object({
  title: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
});

const noteResponseSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    body: z.string(),
    tags: z.array(z.string()),
  })
);

router.post("/", async (req, res) => {
  try {
    if (!res.locals.userId)
      throw new TokenError("Invalid authorization token.");
    let locals = localsSchema.safeParse(res.locals);
    if (!locals.success) throw new TokenError("Invalid authorization token.");
    let userId = locals.data.userId;
    const result = createNoteSchema.safeParse(req.body);
    if (!result.success)
      throw new BadDataError(
        "Invalid data. Required fields are title(string), body(string), and tags(array)."
      );
    const newNode = await db
      .insert(Notes)
      .values({
        title: result.data.title,
        body: result.data.body,
        tags: result.data.tags,
        userId: userId,
      })
      .returning({ title: Notes.title, body: Notes.body });

    res.send(newNode[0]);
  } catch (e) {
    if (e instanceof RouteError)
      return res.status(e.code).json({ error: e.message });
    else return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/", async (req, res) => {
  try {
    if (!res.locals.userId)
      throw new TokenError("Invalid authorization token.");
    let locals = localsSchema.safeParse(res.locals);
    if (!locals.success) throw new TokenError("Invalid authorization token.");
    let userId = locals.data.userId;
    const notes = await db.select().from(Notes).where(eq(Notes.userId, userId));
    let results = noteResponseSchema.safeParse(notes);
    if (!results.success) res.send({ notes: [] });
    else res.send({ notes: results.data });
  } catch (e) {
    if (e instanceof RouteError)
      return res.status(e.code).json({ error: e.message });
    else return res.status(500).json({ error: "Internal server error." });
  }
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
