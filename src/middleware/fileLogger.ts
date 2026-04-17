import { Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { AuthRequest } from '../types';
import { HTTP_STATUS } from '../config/constants';

const logsDir = path.join(__dirname, '../../logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getFormattedDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
};

const getFormattedTime = () => {
  return new Date().toISOString();
};

export const fileLoggerMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function (data: any) {
    const statusCode = res.statusCode;

    if (statusCode >= 400) {
      const fileName = `${getFormattedDate()}.log`;
      const filePath = path.join(logsDir, fileName);

      let errorMessage = 'Unknown error';
      try {
        if (typeof data === 'string') {
          const parsed = JSON.parse(data);
          errorMessage = parsed.message || 'Unknown error';
        } else if (data && typeof data === 'object' && 'message' in data) {
          errorMessage = (data as any).message;
        }
      } catch (e) {
        errorMessage = data?.toString() || 'Unknown error';
      }

      const logEntry = `[${getFormattedTime()}] Status: ${statusCode} | Error: ${errorMessage}\n`;

      fs.appendFileSync(filePath, logEntry, 'utf-8');
    }

    return originalSend.call(this, data);
  };

  next();
};

export default fileLoggerMiddleware;
