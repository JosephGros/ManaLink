import mongoose, { Schema, Document, Model } from 'mongoose';

interface IGame extends Document {
  playgroupId: string;
  date: Date;
  winner: string;
  players: { playerId: string; deck: string }[];
}

const GameSchema: Schema = new Schema({
  playgroupId: { type: String, required: true },
  date: { type: Date, required: true },
  winner: { type: String, required: true },
  players: [
    {
      playerId: { type: String, required: true },
      deck: { type: String, required: true },
    },
  ],
});

const Game: Model<IGame> = mongoose.models.Game || mongoose.model('Game', GameSchema);

export default Game;