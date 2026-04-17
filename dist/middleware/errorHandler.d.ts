import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
interface AppError extends Error {
    statusCode?: number;
}
declare const errorHandler: (error: AppError, req: AuthRequest, res: Response, next: NextFunction) => void;
export default errorHandler;
//# sourceMappingURL=errorHandler.d.ts.map