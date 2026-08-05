import { prisma } from "@/lib/prisma.js";
import { hashSessionToken } from "@/lib/session.js";

export const createSession = (userId: number, token: string, expiresAt: Date) =>
  prisma.session.create({
    data: {
      id: hashSessionToken(token),
      userId,
      expiresAt,
    },
  });

export const findValidSession = (token: string) =>
  prisma.session.findFirst({
    where: {
      id: hashSessionToken(token),
      expiresAt: { gt: new Date() },
    },
    select: { userId: true },
  });
