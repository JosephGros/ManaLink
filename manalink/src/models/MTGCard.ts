import mongoose from 'mongoose';

const MTGCardSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mana_cost: {
    type: String,
    required: true,
  },
  image_uris: {
    small: String,
    normal: String,
    large: String,
    png: String,
    art_crop: String,
    border_crop: String
  },
});

const MTGCard = mongoose.models.MTGCard || mongoose.model('MTGCard', MTGCardSchema);

export default MTGCard;