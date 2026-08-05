import type { NextFunction, Request, Response } from "express";

import { registerUser } from "@/services/auth.service.js";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
} from "@/lib/session.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, sessionToken } = await registerUser(req.body);

    res.cookie(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE_MS,
      path: "/",
    });

    return res.status(201).json({ data: { user } });
  } catch (error) {
    return next(error);
  }
};
