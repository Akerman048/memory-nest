import "dotenv/config";

import { app } from "./app.js";
import { cleanupExpiredAuthRecords } from "./services/auth-cleanup.service.js";

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const configuredCleanupInterval = Number(process.env.SESSION_CLEANUP_INTERVAL_MS);
const cleanupIntervalMs = Number.isInteger(configuredCleanupInterval) && configuredCleanupInterval > 0
  ? configuredCleanupInterval
  : 60 * 60 * 1000;

const cleanup = async () => {
  try {
    const deleted = await cleanupExpiredAuthRecords();
    if (Object.values(deleted).some((count) => count > 0)) {
      console.log("Cleaned expired authentication records", deleted);
    }
  } catch (error) {
    console.error("Could not clean expired authentication records", error);
  }
};

void cleanup();
setInterval(() => void cleanup(), cleanupIntervalMs).unref();
