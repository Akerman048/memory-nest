import type { AccountRole } from "@/generated/prisma/enums.js";
import { prisma } from "@/lib/prisma.js";

type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  accountRole: AccountRole;
};

type UpdateUserInput = Pick<CreateUserInput, "name" | "accountRole">;

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  accountRole: true,
  createdAt: true,
} as const;

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });

export const createUser = (data: CreateUserInput) =>
  prisma.user.create({
    data,
    select: publicUserSelect,
  });

export const findUserById = (id: number) =>
  prisma.user.findUnique({ where: { id }, select: publicUserSelect });

export const updateUser = (id: number, data: UpdateUserInput) =>
  prisma.user.update({ where: { id }, data, select: publicUserSelect });
