import mongoose, { Document, Types } from 'mongoose';
export interface ICard extends Document {
    title: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    businessNumber: string;
    image?: string;
    likes: Types.ObjectId[];
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ICard, {}, {}, {}, mongoose.Document<unknown, {}, ICard> & ICard & {
    _id: Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Card.d.ts.map