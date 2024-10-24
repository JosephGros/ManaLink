import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playgroup',
    required: true,
  },
  playgroupname: {
    type: String,
    ref: 'Playgroup',
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  playerLimit: {
    type: Number,
    required: true,
  },
  attendees: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      status: {
        type: String,
        enum: ['yes', 'no', 'pending'],
        default: 'pending',
      },
    },
  ],
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export default Booking;