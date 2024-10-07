import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  content: string;
  senderId: mongoose.Types.ObjectId;
  recipientId?: mongoose.Types.ObjectId;
  dmId: mongoose.Types.ObjectId;
  roomId?: mongoose.Types.ObjectId;
  type: 'user' | 'group';
  createdAt: Date;
  readBy: mongoose.Types.ObjectId[];
  metadata?: {
    inviteId?: mongoose.Types.ObjectId;
  };
}

const MessageSchema: Schema = new Schema({
  content: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dmId: { type: mongoose.Schema.Types.ObjectId, ref: 'DM' },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Playgroup' },
  type: { type: String, enum: ['user', 'group'], required: true },
  createdAt: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  metadata: {
    inviteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invite' },
  },
});

MessageSchema.pre('save', function (next) {
    if (!this.dmId && !this.roomId) {
      return next(new Error('Either dmId or roomId must be provided'));
    }
    if (this.dmId && this.roomId) {
      return next(new Error('Only one of dmId or roomId can be provided'));
    }
    next();
  });

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;