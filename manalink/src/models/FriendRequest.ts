import mongoose, { Schema, Document, Model } from 'mongoose';

interface IFriendRequest extends Document {
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  dateSent: Date;
  status: 'pending' | 'accepted' | 'declined';
}

const FriendRequestSchema: Schema = new Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateSent: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
});

const FriendRequest: Model<IFriendRequest> =
  mongoose.models.FriendRequest || mongoose.model('FriendRequest', FriendRequestSchema);

export default FriendRequest;