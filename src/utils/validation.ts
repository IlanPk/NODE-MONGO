import joi from 'joi';
import { UserPayload, LoginPayload, PostPayload, EditUserPayload, CardPayload, EditCardPayload } from '../types';

export const validateUserRegistration = (data: unknown) => {
  const schema = joi.object<UserPayload>({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    fullName: joi.string().required(),
    phone: joi.string().optional(),
  });

  return schema.validate(data);
};

export const validateUserLogin = (data: unknown) => {
  const schema = joi.object<LoginPayload>({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  return schema.validate(data);
};

export const validateEditUser = (data: unknown) => {
  const schema = joi.object<EditUserPayload>({
    fullName: joi.string().optional(),
    phone: joi.string().optional(),
    password: joi.string().min(6).optional(),
  });

  return schema.validate(data);
};

export const validateCardCreation = (data: unknown) => {
  const schema = joi.object<CardPayload>({
    title: joi.string().min(3).max(255).required(),
    description: joi.string().min(10).required(),
    phone: joi.string().required(),
    email: joi.string().email().required(),
    address: joi.string().required(),
    businessNumber: joi.string().optional(),
    image: joi.string().optional(),
  });

  return schema.validate(data);
};

export const validateEditCard = (data: unknown) => {
  const schema = joi.object<EditCardPayload>({
    title: joi.string().min(3).max(255).optional(),
    description: joi.string().min(10).optional(),
    phone: joi.string().optional(),
    email: joi.string().email().optional(),
    address: joi.string().optional(),
    businessNumber: joi.string().optional(),
    image: joi.string().optional(),
  });

  return schema.validate(data);
};

export const validatePostCreation = (data: unknown) => {
  const schema = joi.object<PostPayload>({
    title: joi.string().min(3).max(200).required(),
    content: joi.string().min(10).required(),
    description: joi.string().max(500).optional(),
  });

  return schema.validate(data);
};
