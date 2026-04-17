import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const getAllCards: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserCards: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getCardById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createCard: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const editCard: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const likeCard: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteCard: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=cardController.d.ts.map