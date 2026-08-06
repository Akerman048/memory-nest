import { z } from "zod";

export const createMemorySchema = z.object({
  childId: z.number().int().positive(),
  kind: z.enum(["PHOTO", "VIDEO", "NOTE", "MILESTONE"]),
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().max(2000).default(""),
  capturedAt: z.iso.date(),
  mediaAssetId: z.uuid().optional(),
}).superRefine((data, context) => {
  const needsMedia = data.kind === "PHOTO" || data.kind === "VIDEO";
  if (needsMedia && !data.mediaAssetId) {
    context.addIssue({
      code: "custom",
      message: "Photos and videos require a media asset",
      path: ["mediaAssetId"],
    });
  }
  if (!needsMedia && data.mediaAssetId) {
    context.addIssue({
      code: "custom",
      message: "This memory type cannot include a media asset",
      path: ["mediaAssetId"],
    });
  }
});

export const memoryIdParamSchema = z.object({
  memoryId: z.uuid(),
});

export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
