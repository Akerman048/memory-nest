import { AppError } from "@/errors/app-error.js";
import type { AccountRole } from "@/generated/prisma/enums.js";
import { hashPassword } from "@/lib/password.js";
import {
  createSessionToken,
  SESSION_MAX_AGE_MS,
} from "@/lib/session.js";
import { createSession } from "@/repositories/sessions.repository.js";
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

  const user = await createUser({
    name: input.name,
    email: input.email,
    passwordHash,
    accountRole: input.accountRole as AccountRole,
  });

  const sessionToken = createSessionToken();
  const sessionExpiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);

  await createSession(user.id, sessionToken, sessionExpiresAt);

  return { user, sessionToken };
};
