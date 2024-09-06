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

const validateUTF8 = ( str: string ) => {
    try {
        return utf8.encode(str);
    } catch (error: any) {
        console.error('Invalid UTF-8 string: ', error.message);
        throw new Error('Invalid UTF-8 encoding');
    }
}

export async function POST(req: Request) {
    try {
        const { username, email, firstName, lastName, password, confirmPassword, role } = await req.json();

        validateUTF8(username);
        validateUTF8(email);
        validateUTF8(firstName);
        validateUTF8(lastName);

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Passwords do not match!' }, { status: 400 });
        }

        await dbConnect();

        const userCode = await generateUserCode();
        const user = new User({ username, email, firstName, lastName, password, userCode, role });
        await user.save();

        return NextResponse.json({ message: 'User registered successfully!' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Error registered user', details: error.message }, { status: 500 });
    }
}