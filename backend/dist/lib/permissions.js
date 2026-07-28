import { ChildMemberRole } from "../generated/prisma/client.js";
export const canManageChild = (role) => {
    return (role === ChildMemberRole.PARENT ||
        role === ChildMemberRole.GUARDIAN);
};
//# sourceMappingURL=permissions.js.map