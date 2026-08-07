import { Router } from "express";

import { createPresignedUpload } from "@/controllers/uploads.controller.js";
import { requireAuth } from "@/middleware/auth.middleware.js";
import { envRateLimit, rateLimit } from "@/middleware/rate-limit.middleware.js";
import { validateBody } from "@/middleware/validateBody.middleware.js";
import { presignUploadSchema } from "@/validations/media.validation.js";

export const uploadsRouter = Router();

uploadsRouter.use(requireAuth);
uploadsRouter.post(
  "/presign",
  rateLimit({
    name: "upload-presign",
    windowMs: 60 * 1000,
    maxRequests: envRateLimit("UPLOAD_RATE_LIMIT", 30),
    key: (_req, res) => String(res.locals.userId),
  }),
  validateBody(presignUploadSchema),
  createPresignedUpload,
);
