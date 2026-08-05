import { Router } from "express";

import {
  createChild,
  deleteChild,
  getChildById,
  getChildren,
  updateChild,
} from "../controllers/children.controller.js";
import { validateBody } from "@/middleware/validateBody.middleware.js";
import {
  childIdParamSchema,
  createChildSchema,
  updateChildSchema,
} from "@/validations/child.validation.js";
import { validateParams } from "@/middleware/validateParams.middleware.js";
import { requireAuth } from "@/middleware/auth.middleware.js";

export const childrenRouter = Router();

childrenRouter.use(requireAuth);

childrenRouter.get("/", getChildren);

childrenRouter.post("/", validateBody(createChildSchema), createChild);

childrenRouter.get(
  "/:childId",
  validateParams(childIdParamSchema),
  getChildById,
);

childrenRouter.patch(
  "/:childId",
  validateParams(childIdParamSchema),
  validateBody(updateChildSchema),
  updateChild,
);

childrenRouter.delete(
  "/:childId",
  validateParams(childIdParamSchema),
  deleteChild,
);
