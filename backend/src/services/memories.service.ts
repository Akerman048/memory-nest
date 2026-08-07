import { randomUUID } from "node:crypto";
import { extname } from "node:path";

import { AppError } from "@/errors/app-error.js";
import type { MemoryKind } from "@/generated/prisma/enums.js";
import { validateUploadedMedia } from "@/lib/media-security.js";
import { canManageChild } from "@/lib/permissions.js";
import {
  createDownloadUrl,
  createUploadUrl,
  deleteObject,
  inspectObject,
} from "@/lib/s3.js";
import {
  createMediaAssetRepository,
  createMemoryRepository,
  deleteMemoryRepository,
  findAccessibleMemoryRepository,
  findMediaAssetRepository,
  findMemoriesRepository,
} from "@/repositories/memories.repository.js";
import type { CreateMemoryInput } from "@/validations/memory.validation.js";
import type { PresignUploadInput } from "@/validations/media.validation.js";

import { getChildByIdService } from "./children.service.js";

const assertCanManageMemories = async (userId: number, childId: number) => {
  const child = await getChildByIdService(userId, childId);
  const member = child.members.find((item) => item.userId === userId);

  if (!canManageChild(member?.role)) {
    throw new AppError(
      403,
      "MEMORY_WRITE_FORBIDDEN",
      "You do not have permission to manage memories for this child",
    );
  }

  return child;
};

const sanitizeExtension = (fileName: string) => {
  const extension = extname(fileName).toLowerCase().replace(/[^a-z0-9.]/g, "");
  return extension.slice(0, 12);
};

const serializeMemory = async <T extends {
  id: string;
  title: string;
  description: string;
  kind: MemoryKind;
  capturedAt: Date;
  createdAt: Date;
  mediaAsset: { objectKey: string; fileName: string } | null;
}>(memory: T) => ({
  id: memory.id,
  title: memory.title,
  description: memory.description,
  kind: memory.kind.toLowerCase(),
  date: memory.capturedAt.toISOString().slice(0, 10),
  createdAt: memory.createdAt.toISOString(),
  mediaName: memory.mediaAsset?.fileName,
  mediaUrl: memory.mediaAsset
    ? await createDownloadUrl(memory.mediaAsset.objectKey)
    : undefined,
});

export const createPresignedUploadService = async (
  userId: number,
  input: PresignUploadInput,
) => {
  await assertCanManageMemories(userId, input.childId);

  const assetId = randomUUID();
  const objectKey = `children/${input.childId}/memories/${assetId}${sanitizeExtension(input.fileName)}`;

  const uploadUrl = await createUploadUrl(
    objectKey,
    input.contentType,
    input.sizeBytes,
  );

  await createMediaAssetRepository({
    id: assetId,
    childId: input.childId,
    objectKey,
    fileName: input.fileName,
    contentType: input.contentType,
    sizeBytes: input.sizeBytes,
  });

  return {
    assetId,
    uploadUrl,
    headers: {
      "Content-Type": input.contentType,
      "x-amz-tagging": "scan-status=pending",
    },
    expiresInSeconds: 600,
  };
};

export const getMemoriesService = async (userId: number, childId: number) => {
  await getChildByIdService(userId, childId);
  const memories = await findMemoriesRepository(childId);
  return Promise.all(memories.map(serializeMemory));
};

export const createMemoryService = async (
  userId: number,
  input: CreateMemoryInput,
) => {
  await assertCanManageMemories(userId, input.childId);

  let mediaAssetId: string | undefined;
  if (input.mediaAssetId) {
    const asset = await findMediaAssetRepository(input.mediaAssetId, input.childId);

    if (!asset || asset.status !== "PENDING") {
      throw new AppError(400, "INVALID_MEDIA_ASSET", "Media upload is invalid or already used");
    }

    const expectedPrefix = input.kind === "PHOTO" ? "image/" : "video/";
    if (!asset.contentType.startsWith(expectedPrefix)) {
      throw new AppError(400, "MEDIA_TYPE_MISMATCH", "Uploaded media does not match the memory type");
    }

    let uploadedObject;
    try {
      uploadedObject = await inspectObject(asset.objectKey);
    } catch {
      throw new AppError(400, "UPLOAD_NOT_COMPLETE", "Media upload has not completed");
    }

    if (
      uploadedObject.ContentLength !== asset.sizeBytes ||
      uploadedObject.ContentType !== asset.contentType
    ) {
      throw new AppError(400, "UPLOAD_MISMATCH", "Uploaded media does not match the requested file");
    }

    await validateUploadedMedia(asset.objectKey, asset.contentType);

    mediaAssetId = asset.id;
  }

  const memory = await createMemoryRepository({
    childId: input.childId,
    authorId: userId,
    kind: input.kind as MemoryKind,
    title: input.title,
    description: input.description,
    capturedAt: new Date(`${input.capturedAt}T12:00:00.000Z`),
    ...(mediaAssetId ? { mediaAssetId } : {}),
  });

  return serializeMemory(memory);
};

export const deleteMemoryService = async (
  userId: number,
  memoryId: string,
) => {
  const accessibleMemory = await findAccessibleMemoryRepository(memoryId, userId);

  if (!accessibleMemory) {
    throw new AppError(404, "MEMORY_NOT_FOUND", "Memory not found");
  }

  const member = accessibleMemory.child.members[0];
  if (accessibleMemory.authorId !== userId && !canManageChild(member?.role)) {
    throw new AppError(403, "MEMORY_DELETE_FORBIDDEN", "You cannot delete this memory");
  }

  if (accessibleMemory.mediaAsset) {
    await deleteObject(accessibleMemory.mediaAsset.objectKey);
  }

  await deleteMemoryRepository(accessibleMemory.id, accessibleMemory.mediaAsset?.id);
};
