import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Booking from '@/models/Booking';
import User from '@/models/User';
import mongoose from 'mongoose';

interface Attendee {
    userId: string;
    status: 'yes' | 'no' | 'pending';
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('groupId');

    if (!groupId) {
        return NextResponse.json({ success: false, error: 'Group ID required' }, { status: 400 });
    }

    await dbConnect();

    try {
        const bookings = await Booking.find({ groupId }).populate('attendees.userId');
        return NextResponse.json({ success: true, bookings }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { groupId, location, date, time, playerLimit, playgroupname } = await req.json();

    if (!groupId || !location || !date || !time || !playerLimit || !playgroupname) {
        return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    try {
        const booking = new Booking({ groupId, location, date, time, playerLimit, playgroupname });
        await booking.save();
        return NextResponse.json({ success: true, booking }, { status: 201 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('id');
    const { userId, status } = await req.json();

    if (!bookingId) {
        return NextResponse.json({ success: false, error: 'Booking ID required' }, { status: 400 });
    }

    if (!userId || !status) {
        return NextResponse.json({ success: false, error: 'User ID and status are required' }, { status: 400 });
    }

    try {
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
        }

        const existingAttendeeIndex = booking.attendees.findIndex((att: Attendee) => att.userId.toString() === userId);

        if (existingAttendeeIndex !== -1) {
            booking.attendees[existingAttendeeIndex].status = status;
        } else {
            booking.attendees.push({ userId, status });
        }

        await booking.save();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        if (status === 'yes') {
            const alreadyInManalinks = user.manalinks.some((link: { bookingId: mongoose.Types.ObjectId; playgroupId: mongoose.Types.ObjectId }) => link.bookingId.toString() === bookingId);

            user.manalinks = user.manalinks.filter((link: { bookingId: mongoose.Types.ObjectId; playgroupId: mongoose.Types.ObjectId }) => link.bookingId.toString() !== bookingId);

            if (!alreadyInManalinks) {
                user.manalinks.push({
                    bookingId: booking._id,
                    playgroupId: booking.groupId,
                });
            }
        } else if (status === 'no') {
            user.manalinks = user.manalinks.filter((link: { bookingId: mongoose.Types.ObjectId; playgroupId: mongoose.Types.ObjectId }) => link.bookingId.toString() !== bookingId);
        }

        await user.save();

        return NextResponse.json({ success: true, booking }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating booking:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
