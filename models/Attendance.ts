import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    checkIn: Date,
    checkOut: Date,
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'half-day', 'leave'],
        default: 'absent',
    },
    notes: String,
    dressing: {
        type: String,
        enum: ['casual', 'formal', 'none'],
        default: 'none',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index to ensure one attendance record per user per day (handled in logic mostly but good for safety)
AttendanceSchema.index({ user: 1, date: 1 });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
