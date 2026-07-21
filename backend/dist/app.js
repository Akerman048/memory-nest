import cors from "cors";
import express from "express";
import helmet from "helmet";
import { healthRouter } from "./routes/health.routes.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
export const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/health", healthRouter);
app.use("/", notFoundMiddleware);
//# sourceMappingURL=app.js.map