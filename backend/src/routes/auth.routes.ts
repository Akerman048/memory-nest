import { Router } from "express";

import {
  completePasswordReset,
  forgotPassword,
  login,
  logout,
  me,
  register,
  updateProfile,
} from "@/controllers/auth.controller.js";
import { requireAuth } from "@/middleware/auth.middleware.js";
import { validateBody } from "@/middleware/validateBody.middleware.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "@/validations/auth.validation.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", logout);
authRouter.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  forgotPassword,
);
authRouter.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  completePasswordReset,
);
authRouter.get("/me", requireAuth, me);
authRouter.patch("/me", requireAuth, validateBody(updateProfileSchema), updateProfile);
