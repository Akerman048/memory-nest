export const errorMiddleware = (error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        },
    });
};
//# sourceMappingURL=error.middleware.js.map