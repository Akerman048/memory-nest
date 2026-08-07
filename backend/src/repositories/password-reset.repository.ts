import { prisma } from "@/lib/prisma.js";

export const createPasswordResetToken = (
  userId: number,
  tokenHash: string,
  expiresAt: Date,
) =>
  prisma.$transaction(async (transaction) => {
    await transaction.passwordResetToken.deleteMany({ where: { userId } });
    return transaction.passwordResetToken.create({
      data: { id: tokenHash, userId, expiresAt },
    });
  });

export const resetPasswordWithToken = (
  tokenHash: string,
  passwordHash: string,
) =>
  prisma.$transaction(async (transaction) => {
    const token = await transaction.passwordResetToken.findFirst({
      where: { id: tokenHash, expiresAt: { gt: new Date() } },
      select: { userId: true },
    });

    if (!token) return false;

    await transaction.user.update({
      where: { id: token.userId },
      data: { passwordHash },
    });
    await transaction.session.deleteMany({ where: { userId: token.userId } });
    await transaction.passwordResetToken.deleteMany({ where: { userId: token.userId } });

    return true;
  });

export const deleteExpiredPasswordResetTokens = () =>
  prisma.passwordResetToken.deleteMany({
    where: { expiresAt: { lte: new Date() } },
  });
