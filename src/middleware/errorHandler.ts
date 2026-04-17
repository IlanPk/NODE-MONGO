import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { HTTP_STATUS } from '../config/constants';

interface AppError extends Error {
  statusCode?: number;
}

const errorHandler = (error: AppError, req: AuthRequest, res: Response, next: NextFunction): void => {
  console.error(error);

  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: error.stack }),
  });
};

export default errorHandler;
