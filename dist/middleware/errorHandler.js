"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const errorHandler = (error, req, res, next) => {
    console.error(error);
    const statusCode = error.statusCode || constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { error: error.stack }),
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map