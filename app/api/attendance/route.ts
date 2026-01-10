import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Attendance from '@/models/User'; // Oops, I should check models
import { verifyToken, getAuthToken } from '@/lib/auth';
import AttendanceModel from '@/models/Attendance';

export async function GET(request: Request) {
    try {
        const token = await getAuthToken();
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = await verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || decoded.id;

        // Only allow admins to see other's logs
        if (userId !== decoded.id && decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const attendance = await AttendanceModel.find({ user: userId }).sort({ date: -1 });
        return NextResponse.json(attendance);
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
        const { action, note, dressing } = body; // action: 'checkin' | 'checkout'

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let attendance = await AttendanceModel.findOne({
            user: decoded.id,
            date: { $gte: today }
        });

        if (action === 'checkin') {
            if (attendance) {
                return NextResponse.json({ error: 'Already checked in today' }, { status: 400 });
            }
            attendance = await AttendanceModel.create({
                user: decoded.id,
                date: new Date(),
                checkIn: new Date(),
                status: 'present',
                notes: note,
                dressing: dressing || 'none'
            });
        } else if (action === 'checkout') {
            if (!attendance) {
                return NextResponse.json({ error: 'No check-in found for today' }, { status: 400 });
            }
            if (attendance.checkOut) {
                return NextResponse.json({ error: 'Already checked out today' }, { status: 400 });
            }
            attendance.checkOut = new Date();
            if (note) attendance.notes = note;
            await attendance.save();
        }

        return NextResponse.json(attendance);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
