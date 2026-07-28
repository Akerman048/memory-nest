import { Router } from "express";
import { createChild, deleteChild, getChildById, getChildren, updateChild, } from "../controllers/children.controller.js";
export const childrenRouter = Router();
childrenRouter.get("/", getChildren);
childrenRouter.post("/", createChild);
childrenRouter.get("/:childId", getChildById);
childrenRouter.patch("/:childId", updateChild);
childrenRouter.delete("/:childId", deleteChild);
//# sourceMappingURL=children.routes.js.map