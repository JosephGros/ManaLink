import cron from 'node-cron';
import dbConnect from '@/lib/mongoose';
import Booking from '@/models/Booking';

const cleanUpBookings = async (): Promise<void> => {
  await dbConnect();

  const now = new Date();

  try {
    await Booking.deleteMany({
      date: { $lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
    });
  } catch (error) {
    console.error('Error cleaning up bookings:', error);
  }
};

cron.schedule('0 */12 * * *', cleanUpBookings);