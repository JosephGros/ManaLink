import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongoose';
import Playgroup from '@/models/Playgroup';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { playgroupId } = req.query;
    const { userId } = req.body;

    try {
        await dbConnect();

        const playgroup = await Playgroup.findById(playgroupId);
        if (!playgroup) {
            return res.status(404).json({ message: 'Playgroup not found' });
        }

        if (playgroup.members.length >= playgroup.playerLimit) {
            return res.status(400).json({ message: 'Player limit reached' });
        }

        if (playgroup.members.includes(userId)) {
            return res.status(400).json({ message: 'User is already a member of the playgroup' });
        }

        playgroup.members.push(new mongoose.Types.ObjectId(userId));
        await playgroup.save();

        res.status(200).json({ message: 'User added to the playgroup', playgroup });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}