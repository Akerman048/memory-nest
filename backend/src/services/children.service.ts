// src/services/children.service.ts

import { findChildrenByUserIdRepository } from "../repositories/children.repository.js";

export const getChildrenService = async (userId: number) => {
  return findChildrenByUserIdRepository(userId);
};