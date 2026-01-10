import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken, getAuthToken } from '@/lib/auth';

export async function GET() {
    try {
        const token = await getAuthToken();
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = await verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await dbConnect();
        const users = await User.find({ role: 'employee' }).sort({ full_name: 1 });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const token = await getAuthToken();
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = await verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await dbConnect();
        const body = await request.json();
        const { id, userId, updates, ...directData } = body;

        const finalId = id || userId;
        const finalUpdate = updates || directData;

        if (!finalId) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const user = await User.findByIdAndUpdate(
            finalId,
            { ...finalUpdate, updatedAt: new Date() },
            { new: true }
        );

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    return PATCH(request);
}
