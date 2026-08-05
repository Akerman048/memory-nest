import { AppError } from "@/errors/app-error.js";
import type { AccountRole } from "@/generated/prisma/enums.js";
import { hashPassword, verifyPassword } from "@/lib/password.js";
import {
  createSessionToken,
  SESSION_MAX_AGE_MS,
} from "@/lib/session.js";
import { createSession } from "@/repositories/sessions.repository.js";
import { createUser, findUserByEmail } from "@/repositories/users.repository.js";
import type { LoginInput, RegisterInput } from "@/validations/auth.validation.js";

const startSession = async (userId: number) => {
  const sessionToken = createSessionToken();
  const sessionExpiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);

  await createSession(userId, sessionToken, sessionExpiresAt);

  return sessionToken;
};

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

  const sessionToken = await startSession(user.id);

  return { user, sessionToken };
};

export const loginUser = async (input: LoginInput) => {
  const user = await findUserByEmail(input.email);
  const passwordIsValid = user
    ? await verifyPassword(input.password, user.passwordHash)
    : false;

  if (!user || !passwordIsValid) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Email or password is incorrect",
    );
  }

  const sessionToken = await startSession(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      accountRole: user.accountRole,
      createdAt: user.createdAt,
    },
    sessionToken,
  };
};
