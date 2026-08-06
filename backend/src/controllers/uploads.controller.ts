import type { NextFunction, Request, Response } from "express";

import { createPresignedUploadService } from "@/services/memories.service.js";

export const createPresignedUpload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await createPresignedUploadService(
      res.locals.userId as number,
      req.body,
    );
    return res.status(201).json({ data: result });
  } catch (error) {
    return next(error);
  }
};
