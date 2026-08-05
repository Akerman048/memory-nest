import { AppError } from "@/errors/app-error.js";
import type { AccountRole } from "@/generated/prisma/enums.js";
import { hashPassword } from "@/lib/password.js";
import { createUser, findUserByEmail } from "@/repositories/users.repository.js";
import type { RegisterInput } from "@/validations/auth.validation.js";

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new AppError(
      409,
      "EMAIL_ALREADY_REGISTERED",
      "An account with this email already exists",
    );
  }

  const passwordHash = await hashPassword(input.password);

  return createUser({
    name: input.name,
    email: input.email,
    passwordHash,
    accountRole: input.accountRole as AccountRole,
  });
};
