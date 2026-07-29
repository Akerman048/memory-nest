import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validateBody = (schema: ZodType) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: result.error.flatten(),
        },
      });
    }

    req.body = result.data;

    next();
  };
};