import { Router } from "express";
import { prisma } from "@/lib/prisma.js";
export const healthRouter = Router();
healthRouter.get("/live", (_req, res) => {
    return res.status(200).json({
        status: "ok",
    });
});
healthRouter.get("/ready", async (_req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        return res.status(200).json({
            status: "ready",
            database: "connected",
        });
    }
    catch (error) {
        console.error("Readiness check failed:", error);
        return res.status(503).json({
            status: "not_ready",
            database: "disconnected",
        });
    }
});
//# sourceMappingURL=health.routes.js.map