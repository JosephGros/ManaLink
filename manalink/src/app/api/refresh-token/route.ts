import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  const cookies = req.headers.get('cookie');
  const token = cookies?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    await dbConnect();
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const newToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });

    const response = NextResponse.json({ message: 'Token refreshed successfully' });

    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600, // 1 hour
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Error verifying or refreshing token:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}