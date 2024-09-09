import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import utf8 from 'utf8';

const generateUserCode = async (): Promise<string> => {
    
    const min = 100000;
    const max = 999999;
    let userCode: string = '';
    let isUnique = false;

    while (!isUnique) {
        userCode = Math.floor(Math.random() * (max - min + 1)) + min + '';
        
        const existingUser = await User.findOne({ userCode });
        if (!existingUser) {
            isUnique = true;
        }
    }

    return userCode;
};

const sanitizeAndEncodeUTF8 = (str: string): string => {
    if (!str || typeof str !== 'string') {
        throw new Error('Invalid input: expected a valid string');
    }
    return str.trim().normalize('NFC');
};

export async function POST(req: Request) {
    try {
        const { username, email, firstName, lastName, password, confirmPassword, role } = await req.json();

        const sanitizedUsername = sanitizeAndEncodeUTF8(username);
        const sanitizedEmail = sanitizeAndEncodeUTF8(email);
        const sanitizedFirstName = sanitizeAndEncodeUTF8(firstName);
        const sanitizedLastName = sanitizeAndEncodeUTF8(lastName);

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Passwords do not match!' }, { status: 400 });
        }

        await dbConnect();

        const userCode = await generateUserCode();
        const userRole = role ?? 'user';
        console.log({ sanitizedUsername, sanitizedEmail, sanitizedFirstName, sanitizedLastName, password, userCode, role: userRole });
        const user = new User({ 
            username: sanitizedUsername, 
            email: sanitizedEmail, 
            firstName: sanitizedFirstName, 
            lastName: sanitizedLastName, 
            password, 
            userCode, 
            role: userRole });
        await user.save();

        return NextResponse.json({ message: 'User registered successfully!' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Error registered user', details: error.message }, { status: 500 });
    }
}