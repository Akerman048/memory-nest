import { Router } from "express";

import { login, register } from "@/controllers/auth.controller.js";
import { validateBody } from "@/middleware/validateBody.middleware.js";
import { loginSchema, registerSchema } from "@/validations/auth.validation.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
