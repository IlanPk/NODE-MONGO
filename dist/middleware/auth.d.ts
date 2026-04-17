import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const adminMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void;
export default authMiddleware;
//# sourceMappingURL=auth.d.ts.map