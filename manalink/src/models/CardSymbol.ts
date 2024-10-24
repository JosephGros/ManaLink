import mongoose from 'mongoose';

const CardSymbolSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
  },
  svg_uri: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const CardSymbol = mongoose.models.CardSymbol || mongoose.model('CardSymbol', CardSymbolSchema);

export default CardSymbol;