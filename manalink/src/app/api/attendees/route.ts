import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Booking from '@/models/Booking';
import mongoose from 'mongoose';

interface Attendee {
    userId: {
      _id: string;
      username: string;
      profilePicture: string;
      level: number;
    };
    status: 'yes' | 'no' | 'pending';
  }

  interface BookingDocument {
    _id: mongoose.Types.ObjectId;
    groupId: mongoose.Types.ObjectId;
    location: string;
    date: Date;
    time: string;
    playerLimit: number;
    attendees: Attendee[];
  }

export async function GET(req: NextRequest, { params }: { params: { bookingId: string } }) {
    try {
      await dbConnect();
      const { searchParams } = new URL(req.url);
      const bookingId = searchParams.get('bookingId');
      console.log(bookingId);

      const booking = await Booking.findById(bookingId)
      .populate('attendees.userId', '_id username profilePicture level')
      .lean<BookingDocument>();
  
        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
          }
      
          if (!Array.isArray(booking.attendees)) {
            return NextResponse.json({ error: "No attendees available" }, { status: 404 });
          }

      const attendees = booking.attendees.map((attendee: any) => ({
        userId: attendee.userId._id,
        username: attendee.userId.username,
        profilePicture: attendee.userId.profilePicture,
        level: attendee.userId.level,
        status: attendee.status,
      }));
  
      return NextResponse.json({ attendees });
    } catch (error: any) {
      console.error("Error fetching booking attendees:", error);
      return NextResponse.json(
        { error: "Failed to fetch attendees", details: error.message },
        { status: 500 }
      );
    }
  }