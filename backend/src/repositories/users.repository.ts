import type { AccountRole } from "@/generated/prisma/enums.js";
import { prisma } from "@/lib/prisma.js";

type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  accountRole: AccountRole;
};

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });

export const createUser = (data: CreateUserInput) =>
  prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      accountRole: true,
      createdAt: true,
    },
  });
