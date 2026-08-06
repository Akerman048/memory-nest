import type { MemoryKind } from "@/generated/prisma/enums.js";
import { prisma } from "@/lib/prisma.js";

type CreateMediaAssetData = {
  id: string;
  childId: number;
  objectKey: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
};

type CreateMemoryData = {
  childId: number;
  authorId: number;
  kind: MemoryKind;
  title: string;
  description: string;
  capturedAt: Date;
  mediaAssetId?: string;
};

export const createMediaAssetRepository = (data: CreateMediaAssetData) =>
  prisma.mediaAsset.create({ data });

export const findMediaAssetRepository = (id: string, childId: number) =>
  prisma.mediaAsset.findFirst({
    where: { id, childId },
  });

export const findMemoriesRepository = (childId: number) =>
  prisma.memory.findMany({
    where: { childId },
    include: { mediaAsset: true },
    orderBy: [{ capturedAt: "desc" }, { createdAt: "desc" }],
  });

export const findAccessibleMemoryRepository = (id: string, userId: number) =>
  prisma.memory.findFirst({
    where: {
      id,
      child: { members: { some: { userId } } },
    },
    include: {
      mediaAsset: true,
      child: { include: { members: { where: { userId } } } },
    },
  });

export const createMemoryRepository = async (data: CreateMemoryData) =>
  prisma.$transaction(async (transaction) => {
    const memory = await transaction.memory.create({
      data,
      include: { mediaAsset: true },
    });

    if (data.mediaAssetId) {
      await transaction.mediaAsset.update({
        where: { id: data.mediaAssetId },
        data: { status: "READY", uploadedAt: new Date() },
      });
    }

    return memory;
  });

export const deleteMemoryRepository = async (
  memoryId: string,
  mediaAssetId?: string,
) =>
  prisma.$transaction(async (transaction) => {
    await transaction.memory.delete({ where: { id: memoryId } });
    if (mediaAssetId) {
      await transaction.mediaAsset.delete({ where: { id: mediaAssetId } });
    }
  });
