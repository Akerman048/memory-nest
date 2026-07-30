import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validateParams = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid URL parameters",
          details: result.error.flatten(),
        },
      });
    }

    req.params = result.data as typeof req.params;

    next();
  };
};
