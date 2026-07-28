import { canManageChild } from "@/lib/permissions.js";
import {
  createChildRepository,
  deleteChildRepository,
  findChildByIdRepository,
  findChildrenByUserIdRepository,
  updateChildRepository,
} from "../repositories/children.repository.js";

type CreateChildInput = {
  name: string;
  birthDate?: string | null;
};

type UpdateChildInput = {
  name?: string;
  birthDate?: string | null;
};

export const getChildrenService = async (userId: number) => {
  return findChildrenByUserIdRepository(userId);
};

export const getChildByIdService = async (userId: number, childId: number) => {
  return findChildByIdRepository(childId, userId);
};

export const createChildService = async (
  userId: number,
  input: CreateChildInput,
) => {
  const name = input.name.trim();

  if (!name) {
    throw new Error("Child name is required");
  }

  let birthDate: Date | null = null;

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

export const updateChildService = async (
  userId: number,
  childId: number,
  input: UpdateChildInput,
) => {
  const child = await findChildByIdRepository(childId, userId);

  if (!child) {
    return null;
  }

  const currentMember = child.members.find(
    (member) => member.userId === userId,
  );

if (!canManageChild(currentMember?.role)) {
  throw new Error("You do not have permission to update this child");
}

  const data: {
    name?: string;
    birthDate?: Date | null;
  } = {};

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
    } else {
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

export const deleteChildService = async (userId: number, childId: number) => {
  const child = await findChildByIdRepository(childId, userId);

  if (!child) {
    return null;
  }

  const currentMember = child.members.find(
    (member) => member.userId === userId,
  );

  if (currentMember?.role !== "PARENT") {
    throw new Error("Only a parent can delete this child");
  }

  return deleteChildRepository(childId);
};


