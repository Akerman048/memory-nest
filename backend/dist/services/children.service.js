import { canManageChild } from "@/lib/permissions.js";
import { createChildRepository, deleteChildRepository, findChildByIdRepository, findChildrenByUserIdRepository, updateChildRepository, } from "../repositories/children.repository.js";
export const getChildrenService = async (userId) => {
    return findChildrenByUserIdRepository(userId);
};
export const getChildByIdService = async (userId, childId) => {
    return findChildByIdRepository(childId, userId);
};
export const createChildService = async (userId, input) => {
    const name = input.name.trim();
    if (!name) {
        throw new Error("Child name is required");
    }
    let birthDate = null;
    if (input.birthDate) {
        birthDate = new Date(input.birthDate);
        if (Number.isNaN(birthDate.getTime())) {
            throw new Error("Invalid birth date");
        }
        if (birthDate > new Date()) {
            throw new Error("Birth date cannot be in the future");
        }
    }
    return createChildRepository(userId, {
        name,
        birthDate,
    });
};
export const updateChildService = async (userId, childId, input) => {
    const child = await findChildByIdRepository(childId, userId);
    if (!child) {
        return null;
    }
    const currentMember = child.members.find((member) => member.userId === userId);
    if (!canManageChild(currentMember?.role)) {
        throw new Error("You do not have permission to update this child");
    }
    const data = {};
    if (input.name !== undefined) {
        const name = input.name.trim();
        if (!name) {
            throw new Error("Child name cannot be empty");
        }
        data.name = name;
    }
    if (input.birthDate !== undefined) {
        if (input.birthDate === null) {
            data.birthDate = null;
        }
        else {
            const birthDate = new Date(input.birthDate);
            if (Number.isNaN(birthDate.getTime())) {
                throw new Error("Invalid birth date");
            }
            if (birthDate > new Date()) {
                throw new Error("Birth date cannot be in the future");
            }
            data.birthDate = birthDate;
        }
    }
    if (Object.keys(data).length === 0) {
        throw new Error("No fields provided for update");
    }
    return updateChildRepository(childId, data);
};
export const deleteChildService = async (userId, childId) => {
    const child = await findChildByIdRepository(childId, userId);
    if (!child) {
        return null;
    }
    const currentMember = child.members.find((member) => member.userId === userId);
    if (currentMember?.role !== "PARENT") {
        throw new Error("Only a parent can delete this child");
    }
    return deleteChildRepository(childId);
};
//# sourceMappingURL=children.service.js.map