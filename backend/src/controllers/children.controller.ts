import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  createChildService,
  deleteChildService,
  getChildByIdService,
  getChildrenService,
  updateChildService,
} from "../services/children.service.js";

import { AppError } from "@/errors/app-error.js";

type ValidatedChildParams = {
  childId: number;
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
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = 1;

    const { childId } =
      req.params as unknown as ValidatedChildParams;

    const child = await getChildByIdService(
      userId,
      childId,
    );

    if (!child) {
      throw new AppError(
        404,
        "CHILD_NOT_FOUND",
        "Child not found",
      );
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

    const child = await createChildService(
      userId,
      req.body,
    );

    return res.status(201).json({
      data: child,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateChild = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = 1;

    const { childId } =
      req.params as unknown as ValidatedChildParams;

    const child = await updateChildService(
      userId,
      childId,
      req.body,
    );

    if (!child) {
      throw new AppError(
        404,
        "CHILD_NOT_FOUND",
        "Child not found",
      );
    }

    return res.status(200).json({
      data: child,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteChild = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = 1;

    const { childId } =
      req.params as unknown as ValidatedChildParams;

    const deletedChild = await deleteChildService(
      userId,
      childId,
    );

    if (!deletedChild) {
      throw new AppError(
        404,
        "CHILD_NOT_FOUND",
        "Child not found",
      );
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};