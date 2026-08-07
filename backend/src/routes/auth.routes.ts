import { Router } from "express";

import {
  login,
  me,
  register,
  updateProfile,
} from "@/controllers/auth.controller.js";
import { requireAuth } from "@/middleware/auth.middleware.js";
import { validateBody } from "@/middleware/validateBody.middleware.js";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "@/validations/auth.validation.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.get("/me", requireAuth, me);
authRouter.patch("/me", requireAuth, validateBody(updateProfileSchema), updateProfile);
