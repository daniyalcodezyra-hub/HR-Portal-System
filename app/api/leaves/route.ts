import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import LeaveRequest from '@/models/LeaveRequest';
import { verifyToken, getAuthToken } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const token = await getAuthToken();
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = await verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        let query: any = {};
        if (decoded.role === 'admin') {
            if (userId) query.user = userId;
        } else {
            query.user = decoded.id;
        }

        const leaves = await LeaveRequest.find(query).populate('user', 'full_name email').sort({ createdAt: -1 });
        return NextResponse.json(leaves);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const token = await getAuthToken();
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = await verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const body = await request.json();

        const leave = await LeaveRequest.create({
            user: decoded.id,
            ...body
        });

        return NextResponse.json(leave, { status: 201 });
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
        const { id, status, adminNotes } = body;

        const leave = await LeaveRequest.findByIdAndUpdate(
            id,
            { status, adminNotes, updatedAt: new Date() },
            { new: true }
        );

        return NextResponse.json(leave);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
