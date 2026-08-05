import { Router } from "express";

import { register } from "@/controllers/auth.controller.js";
import { validateBody } from "@/middleware/validateBody.middleware.js";
import { registerSchema } from "@/validations/auth.validation.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
