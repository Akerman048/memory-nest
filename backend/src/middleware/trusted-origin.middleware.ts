import type { NextFunction, Request, Response } from "express";

import { AppError } from "@/errors/app-error.js";

const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

export const requireTrustedOrigin = (allowedOrigins: ReadonlySet<string>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (safeMethods.has(req.method)) return next();

    const origin = req.headers.origin;
    if (!origin || allowedOrigins.has(origin)) return next();

    return next(new AppError(403, "UNTRUSTED_ORIGIN", "Request origin is not allowed"));
  };
