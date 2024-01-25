import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const tokenSchema = z.object({
  id: z.number(),
});

export const tokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (token) {
    let userObj = jwt.verify(token, process.env.SECRET || "");
    let result = tokenSchema.safeParse(userObj);
    if (!result.success) {
      return;
    }
    res.locals.userId = result.data.id;
  }

  next();
};
