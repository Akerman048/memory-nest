import { deleteExpiredEmailVerificationTokens } from "@/repositories/email-verification.repository.js";
import { deleteExpiredPasswordResetTokens } from "@/repositories/password-reset.repository.js";
import { deleteExpiredSessions } from "@/repositories/sessions.repository.js";

export const cleanupExpiredAuthRecords = async () => {
  const [sessions, passwordResetTokens, emailVerificationTokens] =
    await Promise.all([
      deleteExpiredSessions(),
      deleteExpiredPasswordResetTokens(),
      deleteExpiredEmailVerificationTokens(),
    ]);

  return {
    sessions: sessions.count,
    passwordResetTokens: passwordResetTokens.count,
    emailVerificationTokens: emailVerificationTokens.count,
  };
};
