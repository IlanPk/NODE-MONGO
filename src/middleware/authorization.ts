import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants';

export const isOwnerOrAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const userId = req.params.id;
  const isOwner = req.user?._id === userId;
  const isAdmin = req.user?.isAdmin;

  if (!isOwner && !isAdmin) {
    res.status(HTTP_STATUS.FORBIDDEN).json({
      message: ERROR_MESSAGES.UNAUTHORIZED,
    });
    return;
  }

  next();
};

export default isOwnerOrAdmin;
