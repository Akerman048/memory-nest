import type { NextFunction, Request, Response } from "express";

import type { ChildParams } from "../types/express.types.js";
import {
  createChildService,
  deleteChildService,
  getChildByIdService,
  getChildrenService,
  updateChildService,
} from "../services/children.service.js";
import { AppError } from "@/errors/app-error.js";

const parsePositiveInteger = (value: string | undefined): number | null => {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
};

export const getChildren = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = 1;
    const children = await getChildrenService(userId);

    return res.status(200).json({
      data: children,
    });
  } catch (error) {
    return next(error);
  }
};

export const getChildById = async (
  req: Request<ChildParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = 1;
    const childId = parsePositiveInteger(req.params.childId);

    if (!childId) {
      throw new AppError(400, "INVALID_CHILD_ID", "Invalid child ID");
    }

    const child = await getChildByIdService(userId, childId);

    if (!child) {
      if (!child) {
        throw new AppError(404, "CHILD_NOT_FOUND", "Child not found");
      }
    }

    return res.status(200).json({
      data: child,
    });
  } catch (error) {
    return next(error);
  }
};

export const createChild = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = 1;

    const child = await createChildService(userId, req.body);

    return res.status(201).json({
      data: child,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateChild = async (
  req: Request<ChildParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = 1;
    const childId = parsePositiveInteger(req.params.childId);

    if (!childId) {
      throw new AppError(400, "INVALID_CHILD_ID", "Invalid child ID");
    }

    const child = await updateChildService(userId, childId, req.body);

    if (!child) {
      throw new AppError(404, "CHILD_NOT_FOUND", "Child not found");
    }

    return res.status(200).json({
      data: child,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteChild = async (
  req: Request<ChildParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = 1;
    const childId = parsePositiveInteger(req.params.childId);

    if (!childId) {
      return res.status(400).json({
        error: {
          code: "INVALID_CHILD_ID",
          message: "Invalid child ID",
        },
      });
    }

    const deletedChild = await deleteChildService(userId, childId);

    if (!deletedChild) {
      throw new AppError(400, "INVALID_CHILD_ID", "Invalid child ID");
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
