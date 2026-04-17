import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const getAllUsers: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const changeBusinessStatus: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateBusinessNumber: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map