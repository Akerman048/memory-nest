import { z } from "zod";

export const createChildSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  birthDate: z.iso.date().nullish(),
});
