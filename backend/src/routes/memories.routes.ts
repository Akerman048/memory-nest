import { Router } from "express";

import {
  createMemory,
  deleteMemory,
  getMemories,
} from "@/controllers/memories.controller.js";
import { requireAuth } from "@/middleware/auth.middleware.js";
import { validateBody } from "@/middleware/validateBody.middleware.js";
import { validateParams } from "@/middleware/validateParams.middleware.js";
import {
  createMemorySchema,
  memoryIdParamSchema,
} from "@/validations/memory.validation.js";

export const memoriesRouter = Router();

memoriesRouter.use(requireAuth);
memoriesRouter.get("/", getMemories);
memoriesRouter.post("/", validateBody(createMemorySchema), createMemory);
memoriesRouter.delete(
  "/:memoryId",
  validateParams(memoryIdParamSchema),
  deleteMemory,
);
