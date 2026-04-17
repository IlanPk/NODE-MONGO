import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    isBusiness: boolean;
    isAdmin: boolean;
    businessNumber?: string;
    failedLoginAttempts: number;
    lastFailedLogin?: Date;
    lockedUntil?: Date;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map