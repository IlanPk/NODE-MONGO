import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, UserPayload, LoginPayload } from '../types';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants';
import { validateUserRegistration, validateUserLogin } from '../utils/validation';

const generateToken = (userId: string, isBusiness: boolean, isAdmin: boolean): string => {
  return jwt.sign({ 
    _id: userId,
    isBusiness,
    isAdmin 
  }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

const FAILED_LOGIN_ATTEMPTS_LIMIT = 3;
const LOCKOUT_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours

export const register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = validateUserRegistration(req.body);

    if (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: error.details[0].message,
      });
      return;
    }

    const userData = value as UserPayload;
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      res.status(HTTP_STATUS.CONFLICT).json({
        message: ERROR_MESSAGES.USER_EXISTS,
      });
      return;
    }

    const newUser = new User(userData);
    await newUser.save();

    const token = generateToken(newUser._id.toString(), newUser.isBusiness, newUser.isAdmin);

    res.status(HTTP_STATUS.CREATED).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = validateUserLogin(req.body);

    if (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: error.details[0].message,
      });
      return;
    }

    const loginData = value as LoginPayload;
    const user = await User.findOne({ email: loginData.email });

    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
      return;
    }

    // Check if user is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
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
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: 'Account locked for 24 hours due to multiple failed login attempts.',
        });
        return;
      }

      await user.save();
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
      return;
    }

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.lastFailedLogin = undefined;
    user.lockedUntil = undefined;
    await user.save();

    const token = generateToken(user._id.toString(), user.isBusiness, user.isAdmin);

    res.status(HTTP_STATUS.OK).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    next(error);
  }
};

