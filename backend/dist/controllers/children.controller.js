import { createChildService, deleteChildService, getChildByIdService, getChildrenService, updateChildService, } from "../services/children.service.js";
const parsePositiveInteger = (value) => {
    if (!value) {
        return null;
    }
    const parsedValue = Number(value);
    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
        return null;
    }
    return parsedValue;
};
export const getChildren = async (_req, res, next) => {
    try {
        const userId = 1;
        const children = await getChildrenService(userId);
        return res.status(200).json({
            data: children,
        });
    }
    catch (error) {
        return next(error);
    }
};
export const getChildById = async (req, res, next) => {
    try {
        const userId = 1;
        const childId = parsePositiveInteger(req.params.childId);
        if (!childId) {
            return res.status(400).json({
                error: {
                    code: "INVALID_CHILD_ID",
                    message: "Invalid child ID",
                },
            });
        }
        const child = await getChildByIdService(userId, childId);
        if (!child) {
            return res.status(404).json({
                error: {
                    code: "CHILD_NOT_FOUND",
                    message: "Child not found",
                },
            });
        }
        return res.status(200).json({
            data: child,
        });
    }
    catch (error) {
        return next(error);
    }
};
export const createChild = async (req, res, next) => {
    try {
        const userId = 1;
        const child = await createChildService(userId, req.body);
        return res.status(201).json({
            data: child,
        });
    }
    catch (error) {
        return next(error);
    }
};
export const updateChild = async (req, res, next) => {
    try {
        const userId = 1;
        const childId = parsePositiveInteger(req.params.childId);
        if (!childId) {
            return res.status(400).json({
                error: {
                    code: "INVALID_CHILD_ID",
                    message: "Invalid child ID",
                },
            });
        }
        const child = await updateChildService(userId, childId, req.body);
        if (!child) {
            return res.status(404).json({
                error: {
                    code: "CHILD_NOT_FOUND",
                    message: "Child not found",
                },
            });
        }
        return res.status(200).json({
            data: child,
        });
    }
    catch (error) {
        return next(error);
    }
};
export const deleteChild = async (req, res, next) => {
    try {
        const userId = 1;
        const childId = parsePositiveInteger(req.params.childId);
        if (!childId) {
            return res.status(400).json({
                error: {
                    code: "INVALID_CHILD_ID",
                    message: "Invalid child ID",
                },
            });
        }
        const deletedChild = await deleteChildService(userId, childId);
        if (!deletedChild) {
            return res.status(404).json({
                error: {
                    code: "CHILD_NOT_FOUND",
                    message: "Child not found",
                },
            });
        }
        return res.status(204).send();
    }
    catch (error) {
        return next(error);
    }
};
//# sourceMappingURL=children.controller.js.map