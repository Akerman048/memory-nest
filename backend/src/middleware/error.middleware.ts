import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  error:unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(error)
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
  });
};
