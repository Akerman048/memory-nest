import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters").max(80),
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(128),
  accountRole: z.enum(["PARENT", "GUARDIAN", "FAMILY_MEMBER", "OTHER"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
