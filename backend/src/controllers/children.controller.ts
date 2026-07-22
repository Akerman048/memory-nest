import type { Request, Response, NextFunction } from "express";
import type { ChildParams } from "../types/express.types.js";
import {
  getChildrenService,
  getChildByIdService,
  updateChildService,
  createChildService,
  deleteChildService,
} from "../services/children.service.js";

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

export const getChildById = async (
  req: Request<ChildParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = parsePositiveInteger(req.params.childId);
    const childId = parsePositiveInteger(req.params.childId);

    if (!userId || !childId) {
      res.status(400).json({
        message: "Invalid user ID or child ID",
      });
      return;
    }

    const child = await getChildByIdService(userId, childId);

    if (!child) {
      res.status(404).json({
        message: "Child not found",
      });
      return;
    }

    res.status(200).json({
      data: child,
    });
  } catch (error) {
    next(error);
  }
};

export const createChild = async (
  req: Request<ChildParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = parsePositiveInteger(req.params.userId);
    if (!userId) {
      res.status(400).json({
        message: "Invalid user ID",
      });

      return;
    }

    const child = await createChildService(userId, req.body);

    res.status(201).json({
      data: child,
    });
  } catch (error) {
    next(error);
  }
};

export const updateChild = async (
  req: Request<ChildParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = parsePositiveInteger(req.params.userId);

    const childId = parsePositiveInteger(req.params.childId);

    if (!userId || !childId) {
      res.status(400).json({
        message: "Invalid user ID or child ID",
      });

      return;
    }

    const child = await updateChildService(userId, childId, req.body);

    if (!child) {
      res.status(404).json({ message: "Child not found" });
      return;
    }

    res.status(200).json({ data: child });
  } catch (error) {
    next(error);
  }
};

export const deleteChild = async (
  req: Request<ChildParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = parsePositiveInteger(
      req.params.userId,
    );

    const childId = parsePositiveInteger(
      req.params.childId,
    );

    if (!userId || !childId) {
      res.status(400).json({
        message: "Invalid user ID or child ID",
      });

      return;
    }

    const deletedChild = await deleteChildService(
      userId,
      childId,
    );

    if (!deletedChild) {
      res.status(404).json({
        message: "Child not found",
      });

      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};