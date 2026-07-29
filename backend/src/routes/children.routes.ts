import { Router } from "express";

import {
  createChild,
  deleteChild,
  getChildById,
  getChildren,
  updateChild,
} from "../controllers/children.controller.js";
import { validateBody } from "@/middleware/validate.middleware.js";
import {
  createChildSchema,
  updateChildSchema,
} from "@/validations/child.validation.js";

export const childrenRouter = Router();

childrenRouter.get("/", getChildren);

childrenRouter.post("/", validateBody(createChildSchema), createChild);

childrenRouter.get("/:childId", getChildById);

childrenRouter.patch("/:childId", validateBody(updateChildSchema), updateChild);

childrenRouter.delete("/:childId", deleteChild);
