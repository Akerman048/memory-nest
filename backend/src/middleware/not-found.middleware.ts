import type { Request, Response,  } from "express";

export const notFoundMiddleware = (
  _req: Request,
  res: Response,
  
) => {
  res.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "Route not found",
    },
  });
};
