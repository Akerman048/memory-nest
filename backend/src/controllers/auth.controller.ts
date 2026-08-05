import type { NextFunction, Request, Response } from "express";

import { registerUser } from "@/services/auth.service.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({ data: { user } });
  } catch (error) {
    return next(error);
  }
};
