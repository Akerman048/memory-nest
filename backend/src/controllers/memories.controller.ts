import type { NextFunction, Request, Response } from "express";

import { AppError } from "@/errors/app-error.js";
import {
  createMemoryService,
  deleteMemoryService,
  getMemoriesService,
} from "@/services/memories.service.js";

export const getMemories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const childId = Number(req.query.childId);
    if (!Number.isInteger(childId) || childId <= 0) {
      throw new AppError(400, "INVALID_CHILD_ID", "A valid childId is required");
    }

    const memories = await getMemoriesService(
      res.locals.userId as number,
      childId,
    );
    return res.status(200).json({ data: memories });
  } catch (error) {
    return next(error);
  }
};

export const createMemory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const memory = await createMemoryService(
      res.locals.userId as number,
      req.body,
    );
    return res.status(201).json({ data: memory });
  } catch (error) {
    return next(error);
  }
};

export const deleteMemory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { memoryId } = req.params as { memoryId: string };
    await deleteMemoryService(res.locals.userId as number, memoryId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
