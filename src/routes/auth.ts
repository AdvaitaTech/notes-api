import { Router } from "express";
import { z } from "zod";
import { RouteError, BadDataError } from "./route-errors";
import { createUser } from "models/users";

const router = Router();

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  confirm: z.string().min(6),
});

router.post("/register", async (req, res) => {
  try {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
      let issue = result.error.issues[0];
      if (issue.code === "too_small") {
        throw new BadDataError(
          "Invalid password length. Must be at least 6 characters."
        );
      } else {
        throw new BadDataError(
          "Invalid data. Required fields are name, email, password and confirm."
        );
      }
    }
    const { name, email, password } = result.data;
    const user = await createUser({ name, email, password });
    return res.json({ user });
  } catch (e) {
    if (e instanceof RouteError)
      return res.status(e.code).json({ error: e.message });
    else return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
