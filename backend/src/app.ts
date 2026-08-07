import cors from "cors";
import express from "express";
import helmet from "helmet";

import { AppError } from "./errors/app-error.js";
import { getAllowedOrigins } from "./lib/http-security.js";
import { healthRouter } from "./routes/health.routes.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { childrenRouter } from "./routes/children.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { memoriesRouter } from "./routes/memories.routes.js";
import { uploadsRouter } from "./routes/uploads.routes.js";
import { requireTrustedOrigin } from "./middleware/trusted-origin.middleware.js";

export const app = express();
const allowedOrigins = new Set(getAllowedOrigins());

app.disable("x-powered-by");
if (process.env.TRUST_PROXY) {
  const numericTrustProxy = Number(process.env.TRUST_PROXY);
  app.set(
    "trust proxy",
    Number.isInteger(numericTrustProxy) ? numericTrustProxy : process.env.TRUST_PROXY,
  );
}

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new AppError(403, "CORS_ORIGIN_DENIED", "Origin is not allowed"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use("/api", requireTrustedOrigin(allowedOrigins));

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/children", childrenRouter);
app.use("/api/memories", memoriesRouter);
app.use("/api/uploads", uploadsRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
