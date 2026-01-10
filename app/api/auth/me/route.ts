import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken, getAuthToken } from '@/lib/auth';

export async function GET() {
    try {
        const token = await getAuthToken();

        if (!token) {
            return NextResponse.json({ user: null });
        }

        const decoded: any = await verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ user: null });
        }

        await dbConnect();
        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ user: null });
        }

        return NextResponse.json({
            user: {
                id: user._id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                department: user.department,
                shift: user.shift,
            }
        });
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({ user: null });
    }
}
