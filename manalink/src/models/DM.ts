import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDM extends Document {
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const DMSchema: Schema = new Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  createdAt: { type: Date, default: Date.now },
});

const DM: Model<IDM> = mongoose.models.DM || mongoose.model<IDM>('DM', DMSchema);

export default DM;