// User roles
export type UserRole = 'admin' | 'employee';

// Profile interface - matches MongoDB User model
export interface Profile {
  _id: string;
  email: string;
  full_name: string;
  role: UserRole;
  shift?: string;
  department?: string;
  phone?: string;
  cnic?: string;
  position?: string;
  salary?: string;
  annual_leaves?: number;
  casual_leaves?: number;
  created_at?: string;
  updated_at?: string;
}

// Attendance status
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'leave';

// Attendance record - matches MongoDB Attendance model
export interface AttendanceRecord {
  _id: string;
  user_id: string | Profile;
  date: string;
  check_in?: string;
  check_out?: string;
  status: string;
  is_late?: boolean;
  notes?: string;
  created_at?: string;
}

// Leave request types
export type LeaveType = 'sick' | 'casual' | 'annual' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

// Leave request - matches MongoDB LeaveRequest model
export interface LeaveRequest {
  _id: string;
  user_id: string | Profile;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  admin_notes?: string;
  created_at?: string;
}

// Announcement priority
export type AnnouncementPriority = 'low' | 'medium' | 'high';

// Announcement - matches MongoDB Announcement model
export interface Announcement {
  _id: string;
  title: string;
  content: string;
  created_by?: string | Profile;
  priority: AnnouncementPriority;
  created_at?: string;
}

// Auth user with profile data
export interface AuthUser extends Profile { }
