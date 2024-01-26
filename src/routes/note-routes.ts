import { Router } from "express";
import { z } from "zod";
import {
  RouteError,
  BadDataError,
  TokenError,
  NotFoundError,
} from "./route-errors";
import { tokenMiddleware } from "middleware";
import { db } from "config/db";
import { Notes } from "config/schema";
import { and, eq, like, or, sql } from "drizzle-orm";

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

const singleNoteSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
});

const noteResponseSchema = z.array(singleNoteSchema);

const updateNoteRequestSchema = z
  .object({
    title: z.string(),
    body: z.string(),
    tags: z.array(z.string()),
  })
  .partial()
  .refine(
    (data) =>
      data.title !== undefined ||
      data.body !== undefined ||
      data.tags !== undefined,
    { message: "Atleast one field must be updated" }
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
      .returning({
        id: Notes.id,
        title: Notes.title,
        body: Notes.body,
        tags: Notes.tags,
      });

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

router.get("/search", async (req, res) => {
  try {
    if (!res.locals.userId)
      throw new TokenError("Invalid authorization token.");
    let locals = localsSchema.safeParse(res.locals);
    if (!locals.success) throw new TokenError("Invalid authorization token.");
    let userId = locals.data.userId;
    let query = req.query.query;
    if (!query)
      throw new BadDataError(
        "Invalid query. query must be a string passed as a query parameter"
      );
    let queryString = `%${query}%`;
    const notes = await db
      .select()
      .from(Notes)
      .where(
        sql`${Notes.userId} = ${userId} AND 
          (${Notes.title} ILIKE ${queryString}
            OR ${Notes.body} ILIKE ${queryString}
            OR EXISTS (SELECT FROM UNNEST(${Notes.tags}) tag WHERE tag ILIKE ${queryString})
          )`
      );
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
  try {
    if (!res.locals.userId)
      throw new TokenError("Invalid authorization token.");
    let locals = localsSchema.safeParse(res.locals);
    if (!locals.success) throw new TokenError("Invalid authorization token.");
    let userId = locals.data.userId;
    let id: number;
    try {
      id = parseInt(req.params.id);
    } catch (e) {
      throw new BadDataError("Invalid note id. id must be an integer");
    }
    const notes = await db
      .select()
      .from(Notes)
      .where(and(eq(Notes.id, id), eq(Notes.userId, userId)));
    let results = noteResponseSchema.safeParse(notes);
    if (!results.success || !results.data[0])
      throw new NotFoundError("Note not found");
    else res.send(results.data[0]);
  } catch (e) {
    if (e instanceof RouteError)
      return res.status(e.code).json({ error: e.message });
    else return res.status(500).json({ error: "Internal server error." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!res.locals.userId)
      throw new TokenError("Invalid authorization token.");
    let locals = localsSchema.safeParse(res.locals);
    if (!locals.success) throw new TokenError("Invalid authorization token.");
    let userId = locals.data.userId;
    let id: number;
    try {
      id = parseInt(req.params.id);
    } catch (e) {
      throw new BadDataError("Invalid note id. id must be an integer");
    }
    let updateQuery = updateNoteRequestSchema.safeParse(req.body);
    if (!updateQuery.success)
      throw new BadDataError("Invalid data. Must provide title, body or tags");
    const notes = await db
      .update(Notes)
      .set(updateQuery.data)
      .where(and(eq(Notes.id, id), eq(Notes.userId, userId)))
      .returning({
        id: Notes.id,
        title: Notes.title,
        body: Notes.body,
        tags: Notes.tags,
      });
    let results = noteResponseSchema.safeParse(notes);
    if (!results.success || !results.data[0])
      throw new NotFoundError("Note not found");
    else res.send(results.data[0]);
  } catch (e) {
    if (e instanceof RouteError)
      return res.status(e.code).json({ error: e.message });
    else return res.status(500).json({ error: "Internal server error." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!res.locals.userId)
      throw new TokenError("Invalid authorization token.");
    let locals = localsSchema.safeParse(res.locals);
    if (!locals.success) throw new TokenError("Invalid authorization token.");
    let userId = locals.data.userId;
    let id: number;
    try {
      id = parseInt(req.params.id);
    } catch (e) {
      throw new BadDataError("Invalid note id. id must be an integer");
    }
    const notes = await db
      .delete(Notes)
      .where(and(eq(Notes.id, id), eq(Notes.userId, userId)))
      .returning({ id: Notes.id });
    if (notes.length === 0)
      throw new NotFoundError("Note not found. Unable to delete");
    res.send({});
  } catch (e) {
    if (e instanceof RouteError)
      return res.status(e.code).json({ error: e.message });
    else return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
