import { Router } from "express";
import { z } from "zod";
import { RouteError, BadDataError } from "./route-errors";

const router = Router();

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  confirm: z.string().min(6),
});

router.post("/register", (req, res) => {
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
    res.json({ success: false });
  } catch (e) {
    if (e instanceof RouteError)
      return res.status(e.code).json({ error: e.message });
    else return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
