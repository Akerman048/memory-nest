// src/repositories/children.repository.ts
import { prisma } from "../lib/prisma.js";
export const findChildrenByUserIdRepository = async (userId) => {
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
export const findChildByIdRepository = async (childId, userId) => {
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
export const createChildRepository = async (userId, data) => {
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
export const updateChildRepository = async (childId, data) => {
    return prisma.child.update({
        where: {
            id: childId,
        },
        data,
    });
};
export const deleteChildRepository = async (childId) => {
    return prisma.child.delete({
        where: {
            id: childId,
        },
    });
};
//# sourceMappingURL=children.repository.js.map