import { NextResponse } from 'next/server';

const fetchClientIp = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Failed to fetch IP from ipify:', error);
        return null;
    }
};

export async function GET() {
    try {
        const ipAddress = await fetchClientIp();

        if (!ipAddress) {
            return NextResponse.json({ error: 'Unable to determine IP address' }, { status: 500 });
        }

        return NextResponse.json({ ip: ipAddress });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch IP address', details: error.message }, { status: 500 });
    }
}
