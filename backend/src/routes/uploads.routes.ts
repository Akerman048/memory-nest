import { Router } from "express";

import { createPresignedUpload } from "@/controllers/uploads.controller.js";
import { requireAuth } from "@/middleware/auth.middleware.js";
import { validateBody } from "@/middleware/validateBody.middleware.js";
import { presignUploadSchema } from "@/validations/media.validation.js";

export const uploadsRouter = Router();

uploadsRouter.use(requireAuth);
uploadsRouter.post("/presign", validateBody(presignUploadSchema), createPresignedUpload);
