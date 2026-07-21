import { getChildren } from "../controllers/children.controller.js";
import { Router } from "express";

export const childrenRouter = Router()

childrenRouter.get('/', getChildren)