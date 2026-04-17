import joi from 'joi';
import { UserPayload, LoginPayload, PostPayload, EditUserPayload, CardPayload, EditCardPayload } from '../types';
export declare const validateUserRegistration: (data: unknown) => joi.ValidationResult<UserPayload>;
export declare const validateUserLogin: (data: unknown) => joi.ValidationResult<LoginPayload>;
export declare const validateEditUser: (data: unknown) => joi.ValidationResult<EditUserPayload>;
export declare const validateCardCreation: (data: unknown) => joi.ValidationResult<CardPayload>;
export declare const validateEditCard: (data: unknown) => joi.ValidationResult<EditCardPayload>;
export declare const validatePostCreation: (data: unknown) => joi.ValidationResult<PostPayload>;
//# sourceMappingURL=validation.d.ts.map