import cors from "cors";
import express from "express";
import helmet from "helmet";

import { healthRouter } from "./routes/health.routes.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { childrenRouter } from "./routes/children.routes.js";
import { authRouter } from "./routes/auth.routes.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/children", childrenRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
