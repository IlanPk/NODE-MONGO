"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePostCreation = exports.validateEditCard = exports.validateCardCreation = exports.validateEditUser = exports.validateUserLogin = exports.validateUserRegistration = void 0;
const joi_1 = __importDefault(require("joi"));
const validateUserRegistration = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        fullName: joi_1.default.string().required(),
        phone: joi_1.default.string().optional(),
    });
    return schema.validate(data);
};
exports.validateUserRegistration = validateUserRegistration;
const validateUserLogin = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
    });
    return schema.validate(data);
};
exports.validateUserLogin = validateUserLogin;
const validateEditUser = (data) => {
    const schema = joi_1.default.object({
        fullName: joi_1.default.string().optional(),
        phone: joi_1.default.string().optional(),
        password: joi_1.default.string().min(6).optional(),
    });
    return schema.validate(data);
};
exports.validateEditUser = validateEditUser;
const validateCardCreation = (data) => {
    const schema = joi_1.default.object({
        title: joi_1.default.string().min(3).max(255).required(),
        description: joi_1.default.string().min(10).required(),
        phone: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        address: joi_1.default.string().required(),
        businessNumber: joi_1.default.string().optional(),
        image: joi_1.default.string().optional(),
    });
    return schema.validate(data);
};
exports.validateCardCreation = validateCardCreation;
const validateEditCard = (data) => {
    const schema = joi_1.default.object({
        title: joi_1.default.string().min(3).max(255).optional(),
        description: joi_1.default.string().min(10).optional(),
        phone: joi_1.default.string().optional(),
        email: joi_1.default.string().email().optional(),
        address: joi_1.default.string().optional(),
        businessNumber: joi_1.default.string().optional(),
        image: joi_1.default.string().optional(),
    });
    return schema.validate(data);
};
exports.validateEditCard = validateEditCard;
const validatePostCreation = (data) => {
    const schema = joi_1.default.object({
        title: joi_1.default.string().min(3).max(200).required(),
        content: joi_1.default.string().min(10).required(),
        description: joi_1.default.string().max(500).optional(),
    });
    return schema.validate(data);
};
exports.validatePostCreation = validatePostCreation;
//# sourceMappingURL=validation.js.map