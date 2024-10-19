import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlaygroup extends Document {
  name: string;
  members: mongoose.Types.ObjectId[];
  admin: mongoose.Types.ObjectId;
  moderators: mongoose.Types.ObjectId[];
  profilePicture: string;
  playgroupCode: string;
  xp: number;
  level: number;
  playerLimit: number;
  games: mongoose.Types.ObjectId[];
  calendar: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const PlaygroupSchema: Schema = new Schema({
  name: { type: String, required: true },
  playgroupCode: { type: String, required: true, unique: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  profilePicture: { type: String, default: '/assets/profile-pics/mtg.webp' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  playerLimit: { type: Number, default: Infinity },
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  calendar: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CalendarBooking' }],
  createdAt: { type: Date, default: Date.now },
});

const Playgroup: Model<IPlaygroup> = mongoose.models.Playgroup || mongoose.model<IPlaygroup>('Playgroup', PlaygroupSchema);

export default Playgroup;