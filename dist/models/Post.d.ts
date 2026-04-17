import mongoose, { Document, Types } from 'mongoose';
export interface IPost extends Document {
    title: string;
    content: string;
    description?: string;
    author: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IPost, {}, {}, {}, mongoose.Document<unknown, {}, IPost> & IPost & {
    _id: Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Post.d.ts.map