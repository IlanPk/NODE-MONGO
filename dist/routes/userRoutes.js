"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const authorization_1 = __importDefault(require("../middleware/authorization"));
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// POST register (public)
router.post('/', authController_1.register);
// POST login (public)
router.post('/login', authController_1.login);
// GET all users (admin only)
router.get('/', auth_1.authMiddleware, auth_1.adminMiddleware, userController_1.getAllUsers);
// GET user by ID (user themselves or admin)
router.get('/:id', auth_1.authMiddleware, authorization_1.default, userController_1.getUserById);
// PUT update user (user themselves)
router.put('/:id', auth_1.authMiddleware, authorization_1.default, userController_1.updateUser);
// PATCH change business status (user themselves)
router.patch('/:id', auth_1.authMiddleware, authorization_1.default, userController_1.changeBusinessStatus);
// PATCH change business number (admin only)
router.patch('/:id/business-number', auth_1.authMiddleware, auth_1.adminMiddleware, userController_1.updateBusinessNumber);
// DELETE user (user themselves or admin)
router.delete('/:id', auth_1.authMiddleware, authorization_1.default, userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map