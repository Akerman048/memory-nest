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
import { envRateLimit, rateLimit } from "@/middleware/rate-limit.middleware.js";
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

const loginRateLimit = rateLimit({
  name: "login",
  windowMs: 15 * 60 * 1000,
  maxRequests: envRateLimit("AUTH_LOGIN_RATE_LIMIT", 10),
});
const registerRateLimit = rateLimit({
  name: "register",
  windowMs: 60 * 60 * 1000,
  maxRequests: envRateLimit("AUTH_REGISTER_RATE_LIMIT", 5),
});
const recoveryRateLimit = rateLimit({
  name: "account-recovery",
  windowMs: 15 * 60 * 1000,
  maxRequests: envRateLimit("AUTH_RECOVERY_RATE_LIMIT", 5),
});

authRouter.post(
  "/register",
  registerRateLimit,
  validateBody(registerSchema),
  register,
);
authRouter.post("/login", loginRateLimit, validateBody(loginSchema), login);
authRouter.post("/logout", logout);
authRouter.post(
  "/forgot-password",
  recoveryRateLimit,
  validateBody(forgotPasswordSchema),
  forgotPassword,
);
authRouter.post(
  "/reset-password",
  recoveryRateLimit,
  validateBody(resetPasswordSchema),
  completePasswordReset,
);
authRouter.post(
  "/resend-verification",
  recoveryRateLimit,
  validateBody(resendVerificationSchema),
  resendVerification,
);
authRouter.post(
  "/verify-email",
  recoveryRateLimit,
  validateBody(verifyEmailSchema),
  completeEmailVerification,
);
authRouter.get("/me", requireAuth, me);
authRouter.patch("/me", requireAuth, validateBody(updateProfileSchema), updateProfile);
