import { AppError } from "@/errors/app-error.js";
import type { AccountRole } from "@/generated/prisma/enums.js";
import { getFrontendUrl, sendTransactionalEmail } from "@/lib/email.js";
import { hashPassword, verifyPassword } from "@/lib/password.js";
import {
  createSessionToken,
  hashSessionToken,
  SESSION_MAX_AGE_MS,
} from "@/lib/session.js";
import {
  createPasswordResetToken,
  resetPasswordWithToken,
} from "@/repositories/password-reset.repository.js";
import { createSession, deleteSession } from "@/repositories/sessions.repository.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
} from "@/repositories/users.repository.js";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  UpdateProfileInput,
} from "@/validations/auth.validation.js";

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

export const getCurrentUser = async (userId: number) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "Your account could not be found");
  }

  return user;
};

export const updateCurrentUser = (userId: number, input: UpdateProfileInput) =>
  updateUser(userId, {
    name: input.name,
    accountRole: input.accountRole as AccountRole,
  });

export const logoutUser = (sessionToken: string) => deleteSession(sessionToken);

const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000;

export const requestPasswordReset = async (input: ForgotPasswordInput) => {
  const user = await findUserByEmail(input.email);
  if (!user) return;

  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  await createPasswordResetToken(
    user.id,
    tokenHash,
    new Date(Date.now() + PASSWORD_RESET_TTL_MS),
  );

  const resetUrl = new URL("/reset-password", getFrontendUrl());
  resetUrl.searchParams.set("token", token);

  try {
    await sendTransactionalEmail({
      to: user.email,
      subject: "Reset your Memory Nest password",
      text: `Hello ${user.name},\n\nUse this secure link to reset your password:\n${resetUrl.toString()}\n\nThis link expires in 30 minutes. If you did not request it, you can ignore this email.`,
      idempotencyKey: `password-reset-${tokenHash}`,
    });
  } catch (error) {
    console.error("Could not deliver password reset email", error);
  }
};

export const resetPassword = async (input: ResetPasswordInput) => {
  const passwordHash = await hashPassword(input.password);
  const reset = await resetPasswordWithToken(
    hashSessionToken(input.token),
    passwordHash,
  );

  if (!reset) {
    throw new AppError(
      400,
      "INVALID_RESET_TOKEN",
      "This password reset link is invalid or expired",
    );
  }
};
