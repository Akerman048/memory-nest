import { z } from "zod";

export const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const allowedVideoTypes = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 250 * 1024 * 1024;

export const presignUploadSchema = z.object({
  childId: z.number().int().positive(),
  fileName: z.string().trim().min(1).max(255),
  contentType: z.enum([...allowedImageTypes, ...allowedVideoTypes]),
  sizeBytes: z.number().int().positive().max(MAX_VIDEO_BYTES),
}).superRefine((data, context) => {
  if (data.contentType.startsWith("image/") && data.sizeBytes > MAX_IMAGE_BYTES) {
    context.addIssue({
      code: "too_big",
      origin: "number",
      maximum: MAX_IMAGE_BYTES,
      inclusive: true,
      message: "Images must be 25 MB or smaller",
      path: ["sizeBytes"],
    });
  }
});

export type PresignUploadInput = z.infer<typeof presignUploadSchema>;
