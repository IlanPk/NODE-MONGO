"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const constants_1 = require("../config/constants");
const validation_1 = require("../utils/validation");
const generateToken = (userId, isBusiness, isAdmin) => {
    return jsonwebtoken_1.default.sign({
        _id: userId,
        isBusiness,
        isAdmin
    }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};
const FAILED_LOGIN_ATTEMPTS_LIMIT = 3;
const LOCKOUT_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours
const register = async (req, res, next) => {
    try {
        const { error, value } = (0, validation_1.validateUserRegistration)(req.body);
        if (error) {
            res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                message: error.details[0].message,
            });
            return;
        }
        const userData = value;
        const existingUser = await User_1.default.findOne({ email: userData.email });
        if (existingUser) {
            res.status(constants_1.HTTP_STATUS.CONFLICT).json({
                message: constants_1.ERROR_MESSAGES.USER_EXISTS,
            });
            return;
        }
        const newUser = new User_1.default(userData);
        await newUser.save();
        const token = generateToken(newUser._id.toString(), newUser.isBusiness, newUser.isAdmin);
        res.status(constants_1.HTTP_STATUS.CREATED).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { error, value } = (0, validation_1.validateUserLogin)(req.body);
        if (error) {
            res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({
                message: error.details[0].message,
            });
            return;
        }
        const loginData = value;
        const user = await User_1.default.findOne({ email: loginData.email });
        if (!user) {
            res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                message: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS,
            });
            return;
        }
        // Check if user is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const remainingTime = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
            res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                message: `Account locked. Try again in ${remainingTime} minutes.`,
            });
            return;
        }
        // Clear lock if expired
        if (user.lockedUntil && user.lockedUntil <= new Date()) {
            user.lockedUntil = undefined;
            user.failedLoginAttempts = 0;
        }
        const isPasswordValid = await user.comparePassword(loginData.password);
        if (!isPasswordValid) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
            user.lastFailedLogin = new Date();
            if (user.failedLoginAttempts >= FAILED_LOGIN_ATTEMPTS_LIMIT) {
                user.lockedUntil = new Date(Date.now() + LOCKOUT_TIME_MS);
                await user.save();
                res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                    message: 'Account locked for 24 hours due to multiple failed login attempts.',
                });
                return;
            }
            await user.save();
            res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({
                message: constants_1.ERROR_MESSAGES.INVALID_CREDENTIALS,
            });
            return;
        }
        // Reset failed attempts on successful login
        user.failedLoginAttempts = 0;
        user.lastFailedLogin = undefined;
        user.lockedUntil = undefined;
        await user.save();
        const token = generateToken(user._id.toString(), user.isBusiness, user.isAdmin);
        res.status(constants_1.HTTP_STATUS.OK).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map