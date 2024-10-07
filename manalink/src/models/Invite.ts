import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvite extends Document {
    playgroupId: mongoose.Types.ObjectId;
    inviterId: mongoose.Types.ObjectId;
    inviteeId: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: Date;
}

const InviteSchema: Schema = new Schema({
    playgroupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Playgroup', required: true },
    inviterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    inviteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

const Invite: Model<IInvite> = mongoose.models.Invite || mongoose.model<IInvite>('Invite', InviteSchema);

export default Invite;