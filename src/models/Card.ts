import mongoose, { Schema, Document, Types } from 'mongoose';

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

const cardSchema = new Schema<ICard>({
  title: {
    type: String,
    required: true,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  businessNumber: {
    type: String,
  },
  image: {
    type: String,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

cardSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ICard>('Card', cardSchema);
