import { Router } from "express";

import {
  completePasswordReset,
  completeEmailVerification,
  forgotPassword,
  login,
  logout,
  me,
  register,
  resendVerification,
  updateProfile,
} from "@/controllers/auth.controller.js";
import { requireAuth } from "@/middleware/auth.middleware.js";
import { validateBody } from "@/middleware/validateBody.middleware.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyEmailSchema,
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
authRouter.post(
  "/resend-verification",
  validateBody(resendVerificationSchema),
  resendVerification,
);
authRouter.post(
  "/verify-email",
  validateBody(verifyEmailSchema),
  completeEmailVerification,
);
authRouter.get("/me", requireAuth, me);
authRouter.patch("/me", requireAuth, validateBody(updateProfileSchema), updateProfile);
