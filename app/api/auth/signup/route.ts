import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        console.log("CRITICAL: Signup Received Body:", JSON.stringify(body, null, 2));

        const {
            email,
            password,
            fullName,
            role,
            phone,
            cnic,
            position,
            shift,
            entryTime,
            exitTime,
            breakIn,
            breakOver,
            salary,
            department
        } = body;

        if (!email || !password || !fullName) {
            return NextResponse.json(
                { error: 'Required: Email, Password, Full Name' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const calculatedRole = (email.toLowerCase().startsWith('admin@') || role === 'admin') ? 'admin' : 'employee';

        // Explicitly defining the object to be saved to avoid any destructuring misses
        const userData = {
            email: email.toLowerCase(),
            password: hashedPassword,
            full_name: fullName,
            role: calculatedRole,
            phone: phone || '',
            cnic: cnic || '',
            position: position || 'Senior Developer',
            salary: salary || '0',
            shift: shift || 'Day Shift',
            department: department || 'Operations',
            entry_time: entryTime || '09:00',
            exit_time: exitTime || '18:00',
            break_in: breakIn || '13:00',
            break_off: breakOver || '14:00'
        };

        console.log("CRITICAL: Attempting to save User with data:", JSON.stringify(userData, null, 2));

        const user = await User.create(userData);

        console.log("CRITICAL: User saved in DB. Actual Document:", JSON.stringify(user, null, 2));

        const userResponse = {
            id: user._id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
        };

        return NextResponse.json({
            message: 'User created successfully',
            user: userResponse
        }, { status: 201 });

    } catch (error: any) {
        console.error('Signup Failure Trace:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
