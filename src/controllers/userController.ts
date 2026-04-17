import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest, EditUserPayload } from '../types';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants';
import { validateEditUser } from '../utils/validation';

export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(HTTP_STATUS.OK).json({
      message: 'Users retrieved successfully',
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: 'User retrieved successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
      return;
    }

    const { error, value } = validateEditUser(req.body);

    if (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: error.details[0].message,
      });
      return;
    }

    const updateData = value as EditUserPayload;

    if (updateData.fullName) user.fullName = updateData.fullName;
    if (updateData.phone) user.phone = updateData.phone;
    if (updateData.password) user.password = updateData.password;

    await user.save();
    const updatedUser = await User.findById(user._id).select('-password');

    res.status(HTTP_STATUS.OK).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const changeBusinessStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
      return;
    }

    user.isBusiness = !user.isBusiness;
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.status(HTTP_STATUS.OK).json({
      message: 'Business status updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBusinessNumber = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { businessNumber } = req.body;

    if (!businessNumber) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Business number is required',
      });
      return;
    }

    // Check if new business number is already taken
    const existingUser = await User.findOne({ businessNumber });

    if (existingUser && existingUser._id.toString() !== req.params.id) {
      res.status(HTTP_STATUS.CONFLICT).json({
        message: 'Business number is already taken',
      });
      return;
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
      return;
    }

    user.businessNumber = businessNumber;
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.status(HTTP_STATUS.OK).json({
      message: 'Business number updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
      return;
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(HTTP_STATUS.OK).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
