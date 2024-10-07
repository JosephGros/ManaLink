import mongoose, { Schema, Document, Model } from 'mongoose';

interface ICalendarBooking extends Document {
  playgroupId: string;
  date: Date;
  title: string;
  description?: string;
}

const CalendarBookingSchema: Schema = new Schema({
  playgroupId: { type: String, required: true },
  date: { type: Date, required: true },
  title: { type: String, required: true },
  description: { type: String },
});

const CalendarBooking: Model<ICalendarBooking> =
  mongoose.models.CalendarBooking || mongoose.model('CalendarBooking', CalendarBookingSchema);

export default CalendarBooking;