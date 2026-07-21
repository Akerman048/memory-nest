export const notFoundMiddleware = (_req, res) => {
    res.status(404).json({
        error: {
            code: "ROUTE_NOT_FOUND",
            message: "Route not found",
        },
    });
};
//# sourceMappingURL=not-found.middleware.js.map