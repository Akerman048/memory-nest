import { Router } from "express";
export const testErrorRouter = Router();
testErrorRouter.get("/", () => {
    throw new Error("Test error");
});
//# sourceMappingURL=test.routes.js.map