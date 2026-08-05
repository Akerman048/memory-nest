import { z } from "zod";

export const createChildSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  birthDate: z.iso.date().nullish(),
  expectedBirthDate: z.iso.date().nullish(),
}).refine(
  (data) => !(data.birthDate && data.expectedBirthDate),
  "Provide either a birth date or an expected birth date",
);

export const updateChildSchema = z.object({
  name: z.string().trim().min(1, "Name is required").optional(),
  birthDate: z.iso.date().nullish(),
  expectedBirthDate: z.iso.date().nullish(),
})
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required",
  )
  .refine(
    (data) => !(data.birthDate && data.expectedBirthDate),
    "Provide either a birth date or an expected birth date",
  );

export const childIdParamSchema = z.object({
  childId: z.coerce.number().int().positive(),
});
