"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateBusinessNumber = exports.changeBusinessStatus = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const constants_1 = require("../config/constants");
const validation_1 = require("../utils/validation");
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User_1.default.find().select('-password').sort({ createdAt: -1 });
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'Users retrieved successfully',
            count: users.length,
            users,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id).select('-password');
        if (!user) {
            res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                message: constants_1.ERROR_MESSAGES.USER_NOT_FOUND,
            });
            return;
        }
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'User retrieved successfully',
            user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                message: constants_1.ERROR_MESSAGES.USER_NOT_FOUND,
            });
            return;
        }
        const { error, value } = (0, validation_1.validateEditUser)(req.body);
        if (error) {
            res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                message: error.details[0].message,
            });
            return;
        }
        const updateData = value;
        if (updateData.fullName)
            user.fullName = updateData.fullName;
        if (updateData.phone)
            user.phone = updateData.phone;
        if (updateData.password)
            user.password = updateData.password;
        await user.save();
        const updatedUser = await User_1.default.findById(user._id).select('-password');
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const changeBusinessStatus = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                message: constants_1.ERROR_MESSAGES.USER_NOT_FOUND,
            });
            return;
        }
        user.isBusiness = !user.isBusiness;
        await user.save();
        const updatedUser = await User_1.default.findById(user._id).select('-password');
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'Business status updated successfully',
            user: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.changeBusinessStatus = changeBusinessStatus;
const updateBusinessNumber = async (req, res, next) => {
    try {
        const { businessNumber } = req.body;
        if (!businessNumber) {
            res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                message: 'Business number is required',
            });
            return;
        }
        // Check if new business number is already taken
        const existingUser = await User_1.default.findOne({ businessNumber });
        if (existingUser && existingUser._id.toString() !== req.params.id) {
            res.status(constants_1.HTTP_STATUS.CONFLICT).json({
                message: 'Business number is already taken',
            });
            return;
        }
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                message: constants_1.ERROR_MESSAGES.USER_NOT_FOUND,
            });
            return;
        }
        user.businessNumber = businessNumber;
        await user.save();
        const updatedUser = await User_1.default.findById(user._id).select('-password');
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'Business number updated successfully',
            user: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateBusinessNumber = updateBusinessNumber;
const deleteUser = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({
                message: constants_1.ERROR_MESSAGES.USER_NOT_FOUND,
            });
            return;
        }
        await User_1.default.findByIdAndDelete(req.params.id);
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'User deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map