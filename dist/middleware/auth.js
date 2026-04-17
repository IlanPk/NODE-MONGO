"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../config/constants");
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                message: constants_1.ERROR_MESSAGES.INVALID_TOKEN,
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
            message: constants_1.ERROR_MESSAGES.TOKEN_EXPIRED,
        });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    if (!req.user?.isAdmin) {
        res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
            message: constants_1.ERROR_MESSAGES.UNAUTHORIZED,
        });
        return;
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
exports.default = exports.authMiddleware;
//# sourceMappingURL=auth.js.map