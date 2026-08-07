import "dotenv/config";

import { prisma } from "@/lib/prisma.js";
import { cleanupExpiredAuthRecords } from "@/services/auth-cleanup.service.js";

try {
  const deleted = await cleanupExpiredAuthRecords();
  console.log("Cleaned expired authentication records", deleted);
} catch (error) {
  console.error("Could not clean expired authentication records", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
