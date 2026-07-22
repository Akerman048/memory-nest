// src/repositories/children.repository.ts

import { prisma } from "../lib/prisma.js";

type CreateChildData = {
  name: string;
  birthDate?: Date | null;
};

type UpdateChildData = {
  name?: string;
  birthDate?: Date | null;
};

export const findChildrenByUserIdRepository = async (
  userId: number,
) => {
  return prisma.child.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: {
        where: {
          userId,
        },
        select: {
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findChildByIdRepository = async (
  childId: number,
  userId: number,
) => {
  return prisma.child.findFirst({
    where: {
      id: childId,
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: {
        where: {
          userId,
        },
        select: {
          userId: true,
          role: true,
        },
      },
    },
  });
};

export const createChildRepository = async (
  userId: number,
  data: CreateChildData,
) => {
  return prisma.child.create({
    data: {
      name: data.name,

      ...(data.birthDate !== undefined && {
        birthDate: data.birthDate,
      }),

      members: {
        create: {
          userId,
          role: "PARENT",
        },
      },
    },
    include: {
      members: true,
    },
  });
};

export const updateChildRepository = async (
  childId: number,
  data: UpdateChildData,
) => {
  return prisma.child.update({
    where: {
      id: childId,
    },
    data,
  });
};

export const deleteChildRepository = async (
  childId: number,
) => {
  return prisma.child.delete({
    where: {
      id: childId,
    },
  });
};