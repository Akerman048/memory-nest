import type { Request, Response, NextFunction } from "express";
import { getChildrenService } from "../services/children.service.js";

export const getChildren = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = 1;
    const children = await getChildrenService(userId);

    res.json(children);
  } catch (error) {
    next(error);
  }
};
