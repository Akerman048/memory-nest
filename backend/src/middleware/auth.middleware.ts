import type { NextFunction, Request, Response } from "express";

import { AppError } from "@/errors/app-error.js";
import { readCookie, SESSION_COOKIE_NAME } from "@/lib/session.js";
import { findValidSession } from "@/repositories/sessions.repository.js";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = readCookie(req.headers.cookie, SESSION_COOKIE_NAME);

    if (!token) {
      throw new AppError(401, "AUTH_REQUIRED", "Please create an account or log in");
    }

    const session = await findValidSession(token);

    if (!session) {
      throw new AppError(401, "SESSION_EXPIRED", "Your session has expired");
    }

    res.locals.userId = session.userId;
    return next();
  } catch (error) {
    return next(error);
  }
};
