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

    await deleteChildService(userId, childId);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};