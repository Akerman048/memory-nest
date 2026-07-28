import { ChildMemberRole } from "../generated/prisma/client.js";

export const canManageChild = (
  role: ChildMemberRole | undefined,
): boolean => {
  return (
    role === ChildMemberRole.PARENT ||
    role === ChildMemberRole.GUARDIAN
  );
};