"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwnerOrAdmin = void 0;
const constants_1 = require("../config/constants");
const isOwnerOrAdmin = (req, res, next) => {
    const userId = req.params.id;
    const isOwner = req.user?._id === userId;
    const isAdmin = req.user?.isAdmin;
    if (!isOwner && !isAdmin) {
        res.status(constants_1.HTTP_STATUS.FORBIDDEN).json({
            message: constants_1.ERROR_MESSAGES.UNAUTHORIZED,
        });
        return;
    }
    next();
};
exports.isOwnerOrAdmin = isOwnerOrAdmin;
exports.default = exports.isOwnerOrAdmin;
//# sourceMappingURL=authorization.js.map