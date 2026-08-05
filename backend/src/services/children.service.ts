import { AppError } from "@/errors/app-error.js";
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
  expectedBirthDate?: string | null;
};

type UpdateChildInput = {
  name?: string;
  birthDate?: string | null;
  expectedBirthDate?: string | null;
};

export const getChildrenService = async (userId: number) => {
  return findChildrenByUserIdRepository(userId);
};

export const getChildByIdService = async (
  userId: number,
  childId: number,
) => {
  const child = await findChildByIdRepository(
    childId,
    userId,
  );

  if (!child) {
    throw new AppError(
      404,
      "CHILD_NOT_FOUND",
      "Child not found",
    );
  }

  return child;
};

export const createChildService = async (
  userId: number,
  input: CreateChildInput,
) => {
  const name = input.name.trim();

  if (!name) {
    throw new AppError(
      400,
      "INVALID_CHILD_NAME",
      "Child name is required",
    );
  }

  let birthDate: Date | null = null;
  let expectedBirthDate: Date | null = null;

  if (input.birthDate) {
    birthDate = new Date(input.birthDate);

    if (Number.isNaN(birthDate.getTime())) {
      throw new AppError(
        400,
        "INVALID_BIRTH_DATE",
        "Invalid birth date",
      );
    }

    if (birthDate > new Date()) {
      throw new AppError(
        400,
        "BIRTH_DATE_IN_FUTURE",
        "Birth date cannot be in the future",
      );
    }
  }

  if (input.expectedBirthDate) {
    expectedBirthDate = new Date(input.expectedBirthDate);

    if (Number.isNaN(expectedBirthDate.getTime())) {
      throw new AppError(400, "INVALID_EXPECTED_BIRTH_DATE", "Invalid expected birth date");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (expectedBirthDate < today) {
      throw new AppError(
        400,
        "EXPECTED_BIRTH_DATE_IN_PAST",
        "Expected birth date cannot be in the past",
      );
    }
  }

  return createChildRepository(userId, {
    name,
    birthDate,
    expectedBirthDate,
  });
};

export const updateChildService = async (
  userId: number,
  childId: number,
  input: UpdateChildInput,
) => {
  const child = await findChildByIdRepository(
    childId,
    userId,
  );

  if (!child) {
    throw new AppError(
      404,
      "CHILD_NOT_FOUND",
      "Child not found",
    );
  }

  const currentMember = child.members.find(
    (member) => member.userId === userId,
  );

  if (!canManageChild(currentMember?.role)) {
    throw new AppError(
      403,
      "CHILD_UPDATE_FORBIDDEN",
      "You do not have permission to update this child",
    );
  }

  const data: {
    name?: string;
    birthDate?: Date | null;
    expectedBirthDate?: Date | null;
  } = {};

  if (input.name !== undefined) {
    const name = input.name.trim();

    if (!name) {
      throw new AppError(
        400,
        "INVALID_CHILD_NAME",
        "Child name cannot be empty",
      );
    }

    data.name = name;
  }

  if (input.birthDate !== undefined) {
    if (input.birthDate === null) {
      data.birthDate = null;
    } else {
      const birthDate = new Date(input.birthDate);

      if (Number.isNaN(birthDate.getTime())) {
        throw new AppError(
          400,
          "INVALID_BIRTH_DATE",
          "Invalid birth date",
        );
      }

      if (birthDate > new Date()) {
        throw new AppError(
          400,
          "BIRTH_DATE_IN_FUTURE",
          "Birth date cannot be in the future",
        );
      }

      data.birthDate = birthDate;
    }
  }

  if (input.expectedBirthDate !== undefined) {
    if (input.expectedBirthDate === null) {
      data.expectedBirthDate = null;
    } else {
      const expectedBirthDate = new Date(input.expectedBirthDate);

      if (Number.isNaN(expectedBirthDate.getTime())) {
        throw new AppError(400, "INVALID_EXPECTED_BIRTH_DATE", "Invalid expected birth date");
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (expectedBirthDate < today) {
        throw new AppError(
          400,
          "EXPECTED_BIRTH_DATE_IN_PAST",
          "Expected birth date cannot be in the past",
        );
      }

      data.expectedBirthDate = expectedBirthDate;
    }
  }

  if (Object.keys(data).length === 0) {
    throw new AppError(
      400,
      "NO_UPDATE_FIELDS",
      "No fields provided for update",
    );
  }

  return updateChildRepository(childId, data);
};

export const deleteChildService = async (
  userId: number,
  childId: number,
) => {
  const child = await findChildByIdRepository(
    childId,
    userId,
  );

  if (!child) {
    throw new AppError(
      404,
      "CHILD_NOT_FOUND",
      "Child not found",
    );
  }

  const currentMember = child.members.find(
    (member) => member.userId === userId,
  );

  if (currentMember?.role !== "PARENT") {
    throw new AppError(
      403,
      "CHILD_DELETE_FORBIDDEN",
      "Only a parent can delete this child",
    );
  }

  return deleteChildRepository(childId);
};
