import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const isOwnerOrAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
export default isOwnerOrAdmin;
//# sourceMappingURL=authorization.d.ts.map