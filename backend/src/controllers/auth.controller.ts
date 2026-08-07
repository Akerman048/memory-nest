import type { NextFunction, Request, Response } from "express";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword,
  updateCurrentUser,
  verifyEmail,
} from "@/services/auth.service.js";
import {
  readCookie,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS,
} from "@/lib/session.js";
import { getSessionCookieOptions } from "@/lib/http-security.js";

const setSessionCookie = (res: Response, sessionToken: string) => {
  res.cookie(
    SESSION_COOKIE_NAME,
    sessionToken,
    getSessionCookieOptions(SESSION_MAX_AGE_MS),
  );
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = await registerUser(req.body);

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

    res.clearCookie(SESSION_COOKIE_NAME, getSessionCookieOptions());
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

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await requestPasswordReset(req.body);
    return res.status(202).json({
      data: {
        message: "If an account exists for that email, a reset link has been sent.",
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const completePasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await resetPassword(req.body);
    return res.status(200).json({
      data: { message: "Your password has been reset." },
    });
  } catch (error) {
    return next(error);
  }
};

export const resendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await resendVerificationEmail(req.body);
    return res.status(202).json({
      data: {
        message: "If the account needs verification, a new link has been sent.",
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const completeEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, sessionToken } = await verifyEmail(req.body);
    setSessionCookie(res, sessionToken);
    return res.status(200).json({ data: { user } });
  } catch (error) {
    return next(error);
  }
};
