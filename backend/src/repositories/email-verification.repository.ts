import { prisma } from "@/lib/prisma.js";

export const createEmailVerificationToken = (
  userId: number,
  tokenHash: string,
  expiresAt: Date,
) =>
  prisma.$transaction(async (transaction) => {
    await transaction.emailVerificationToken.deleteMany({ where: { userId } });
    return transaction.emailVerificationToken.create({
      data: { id: tokenHash, userId, expiresAt },
    });
  });

export const verifyEmailWithToken = (tokenHash: string) =>
  prisma.$transaction(async (transaction) => {
    const token = await transaction.emailVerificationToken.findFirst({
      where: { id: tokenHash, expiresAt: { gt: new Date() } },
      select: { userId: true },
    });

    if (!token) return null;

    const user = await transaction.user.update({
      where: { id: token.userId },
      data: { emailVerifiedAt: new Date() },
      select: {
        id: true,
        name: true,
        email: true,
        accountRole: true,
        emailVerifiedAt: true,
        createdAt: true,
      },
    });
    await transaction.emailVerificationToken.deleteMany({
      where: { userId: token.userId },
    });

    return user;
  });

export const deleteExpiredEmailVerificationTokens = () =>
  prisma.emailVerificationToken.deleteMany({
    where: { expiresAt: { lte: new Date() } },
  });
