import "dotenv/config";

import { deleteObject } from "@/lib/s3.js";
import { prisma } from "@/lib/prisma.js";

const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

async function cleanup() {
  const pendingAssets = await prisma.mediaAsset.findMany({
    where: {
      status: "PENDING",
      createdAt: { lt: cutoff },
    },
    select: { id: true, objectKey: true },
    take: 500,
  });

  let deleted = 0;
  for (const asset of pendingAssets) {
    try {
      await deleteObject(asset.objectKey);
      await prisma.mediaAsset.delete({ where: { id: asset.id } });
      deleted += 1;
    } catch (error) {
      console.error(`Could not clean pending media asset ${asset.id}`, error);
    }
  }

  console.log(`Cleaned ${deleted} pending media asset(s)`);
}

try {
  await cleanup();
} finally {
  await prisma.$disconnect();
}
