import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: JwtPayload & { _id: string; isBusiness: boolean; isAdmin: boolean };
  params: Record<string, string>;
  body: any;
  query: Record<string, string>;
}

export interface UserPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface EditUserPayload {
  fullName?: string;
  phone?: string;
  password?: string;
}

export interface CardPayload {
  title: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  businessNumber?: string;
  image?: string;
}

export interface EditCardPayload {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  businessNumber?: string;
  image?: string;
}

export interface PostPayload {
  title: string;
  content: string;
  description?: string;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  count?: number;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}
