CREATE TYPE "MemoryKind" AS ENUM ('PHOTO', 'VIDEO', 'NOTE', 'MILESTONE');
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'READY');

CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "childId" INTEGER NOT NULL,
    "objectKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDING',
    "uploadedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "childId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "mediaAssetId" TEXT,
    "kind" "MemoryKind" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "capturedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MediaAsset_objectKey_key" ON "MediaAsset"("objectKey");
CREATE INDEX "MediaAsset_childId_status_idx" ON "MediaAsset"("childId", "status");
CREATE UNIQUE INDEX "Memory_mediaAssetId_key" ON "Memory"("mediaAssetId");
CREATE INDEX "Memory_childId_capturedAt_idx" ON "Memory"("childId", "capturedAt");
CREATE INDEX "Memory_authorId_idx" ON "Memory"("authorId");

ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
