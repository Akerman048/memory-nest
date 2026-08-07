import type { NextFunction, Request, Response } from "express";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateCurrentUser,
} from "@/services/auth.service.js";
import {
  readCookie,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
} from "@/lib/session.js";

const setSessionCookie = (res: Response, sessionToken: string) => {
  res.cookie(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE_MS,
      path: "/",
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, sessionToken } = await registerUser(req.body);
    setSessionCookie(res, sessionToken);

    return res.status(201).json({ data: { user } });
  } catch (error) {
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, sessionToken } = await loginUser(req.body);
    setSessionCookie(res, sessionToken);

    return res.status(200).json({ data: { user } });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionToken = readCookie(req.headers.cookie, SESSION_COOKIE_NAME);

    if (sessionToken) {
      await logoutUser(sessionToken);
    }

    res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export const me = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getCurrentUser(res.locals.userId as number);
    return res.status(200).json({ data: { user } });
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await updateCurrentUser(res.locals.userId as number, req.body);
    return res.status(200).json({ data: { user } });
  } catch (error) {
    return next(error);
  }
};
