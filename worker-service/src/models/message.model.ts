import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  email: string;
  message: string;
  createdAt: Date;
}


const messageSchema = new Schema<IMessage>({
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);
