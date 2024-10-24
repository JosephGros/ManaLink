import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Booking from '@/models/Booking';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { manalinks } = await req.json();

    if (!manalinks || manalinks.length === 0) {
      return NextResponse.json({ error: 'No manalinks provided' }, { status: 400 });
    }

    const objectIds = manalinks.map((id: string) => new mongoose.Types.ObjectId(id));

    const bookings = await Booking.find({
      _id: { $in: objectIds },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching bookings' }, { status: 500 });
  }
}