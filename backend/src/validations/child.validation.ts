import { z } from "zod";

export const createChildSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  birthDate: z.iso.date().nullish(),
});

export const updateChildSchema = createChildSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required",
  );

export const childIdParamSchema = z.object({
  childId: z.coerce.number().int().positive(),
});
