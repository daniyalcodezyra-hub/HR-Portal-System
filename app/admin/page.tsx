'use client';

import React, { useState, useEffect } from 'react';
import {
    Users, UserCheck, Clock,
    Search, Table as TableIcon, Edit3, Trash2,
    RefreshCcw, Loader2, QrCode, UserMinus
} from 'lucide-react';
import { Card, Badge, PrimaryButton, Modal, Input } from '@/components/SharedUI';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProfile, setEditingProfile] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, attendanceRes] = await Promise.all([
                fetch('/api/users'),
                fetch('/api/attendance')
            ]);

            if (!usersRes.ok || !attendanceRes.ok) throw new Error("Sync failed");

            const allUsers = await usersRes.json();
            const attendance = await attendanceRes.json();

            const today = new Date();
            const todayInPK = today.toLocaleDateString('en-CA');
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            const combined = allUsers.map((u: any) => {
                const userAtt = attendance.filter((a: any) => a.user_id?._id === u._id);
                const attToday = userAtt.find((a: any) => a.date.startsWith(todayInPK));

                // Monthly stats
                const monthlyAtt = userAtt.filter((a: any) => {
                    const d = new Date(a.date);
                    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                });

                const lates = monthlyAtt.filter((a: any) => a.status === 'late').length;
                const absents = monthlyAtt.filter((a: any) => a.status === 'absent').length;
                const leaves = monthlyAtt.filter((a: any) => a.status === 'leave').length;

                return {
                    ...u,
                    check_in: attToday?.check_in || '-',
                    check_out: attToday?.check_out || '-',
                    dressing: attToday?.dressing || 'NONE',
                    attendance_status: attToday?.status || 'A',
                    is_late_today: attToday?.status === 'late',
                    late_summary: `${lates} Late, ${absents} Absent`,
                    monthly_leaves: leaves
                };
            });

            setData(combined);
        } catch (error) {
            toast.error("Network connection unstable");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatTime = (timeStr: any) => {
        if (!timeStr || timeStr === '-' || timeStr === 'NONE') return '-';
        // Handle ISO strings from Date objects
        if (typeof timeStr === 'string' && timeStr.includes('T')) {
            try {
                const date = new Date(timeStr);
                if (isNaN(date.getTime())) return timeStr;
                return date.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: false });
            } catch (e) {
                return timeStr;
            }
        }
        return timeStr;
    };

    const filteredData = data.filter(p =>
        p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cnic?.includes(searchTerm)
    );

    const handleEdit = (profile: any) => {
        setEditingProfile({ ...profile });
        setShowEditModal(true);
    };

    const stats = [
        { label: "Today Strength", value: data.length.toString(), icon: <Users size={24} />, color: 'bg-black' },
        { label: 'Today Present', value: data.filter(p => p.attendance_status === 'present' || p.attendance_status === 'late').length.toString(), icon: <UserCheck size={24} />, color: 'bg-emerald-500' },
        { label: 'Today Late', value: data.filter(p => p.attendance_status === 'late').length.toString(), icon: <Clock size={24} />, color: 'bg-amber-500' },
        { label: 'Today Absent', value: data.filter(p => p.attendance_status === 'absent' || p.attendance_status === 'A').length.toString(), icon: <UserMinus size={24} />, color: 'bg-rose-500' },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="animate-spin text-black" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Syncing Intelligence...</p>
        </div>
    );

    return (
        <div className="space-y-12">

            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 bg-zinc-50/50 p-8 rounded-[3rem] border border-zinc-100">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Live Control Center</p>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tighter uppercase leading-[0.85]">
                        Today's <br /> Stream
                    </h1>
                    <div className="flex items-center gap-6 pt-2">
                        <div className="flex flex-col">
                            <span className="text-[12px] font-black text-black uppercase">PK Time Zone</span>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">{new Date().toLocaleTimeString('en-PK', { hour12: false })}</span>
                        </div>
                        <div className="h-8 w-px bg-zinc-200"></div>
                        <div className="flex flex-col">
                            <span className="text-[12px] font-black text-black uppercase">Active Policy</span>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Sunday: Off Duty</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <PrimaryButton
                        icon={QrCode}
                        onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(window.location.host + '/employee')}`, '_blank')}
                        className="bg-black text-white hover:bg-zinc-800 transition-all shadow-xl"
                    >
                        Terminal QR
                    </PrimaryButton>
                    <PrimaryButton icon={RefreshCcw} onClick={fetchData} className="bg-white !text-black border border-zinc-200 hover:border-black shadow-none transition-all">
                        Update Feed
                    </PrimaryButton>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-8 group border-zinc-100 shadow-sm relative overflow-hidden">
                        <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-6`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-black text-black tracking-tighter">{stat.value}</h3>
                                <span className="text-[10px] font-black text-zinc-300 uppercase">Agents</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="!p-0 border-zinc-100 shadow-2xl rounded-[2rem] overflow-hidden">
                <div className="p-6 sm:p-10 border-b border-zinc-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-zinc-50/20">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-xl flex items-center justify-center">
                            <TableIcon size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-black text-black tracking-tight leading-none mb-1">Master Registry</h3>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Real-time Deployment Tracking</p>
                        </div>
                    </div>
                    <div className="relative w-full lg:max-w-xs">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                        <input
                            type="text"
                            placeholder="Lookup..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-5 py-4 bg-white border border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-black transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap min-w-[2400px] border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-y border-zinc-100">
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-r border-zinc-100">ID</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-r border-zinc-100">Employee Name</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-r border-zinc-100">Attendance</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-r border-zinc-100">Actual In</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-r border-zinc-100">Actual Out</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-r border-zinc-100">Casual Leave</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-r border-zinc-100">Half Day</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-r border-zinc-100">Mobile No</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-r border-zinc-100">Position</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-r border-zinc-100">Job Title</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-r border-zinc-100">CNIC No</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-r border-zinc-100">Timing In</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-r border-zinc-100">Timing Out</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-r border-zinc-100">Late Summary</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-r border-zinc-100">Break In</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-r border-zinc-100">Break Off</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-r border-zinc-100">Shift</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-r border-zinc-100">Email</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-r border-zinc-100">Casual Dressing</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Formal Dressing</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredData.map((emp, i) => (
                                <tr key={emp._id} className="hover:bg-zinc-50/50 transition-colors text-[11px] font-bold">
                                    <td className="px-6 py-5 border-r border-zinc-100 text-zinc-400">{i + 1}</td>
                                    <td className="px-6 py-5 border-r border-zinc-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center font-black text-[10px]">
                                                {emp.full_name?.[0]}
                                            </div>
                                            <span className="uppercase text-black font-black whitespace-nowrap">{emp.full_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center border-r border-zinc-100">
                                        <Badge variant={emp.attendance_status === 'present' ? 'emerald' : emp.attendance_status === 'late' ? 'amber' : 'rose'}>
                                            {emp.attendance_status === 'present' ? 'P' : emp.attendance_status === 'late' ? 'L' : 'A'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5 text-center border-r border-zinc-100 tabular-nums text-emerald-600 font-black">{formatTime(emp.check_in)}</td>
                                    <td className="px-6 py-5 text-center border-r border-zinc-100 tabular-nums text-rose-600 font-black">{formatTime(emp.check_out)}</td>
                                    <td className="px-6 py-5 text-center border-r border-zinc-100 text-zinc-500">{emp.casual_leaves || emp.monthly_leaves || '-'}</td>
                                    <td className="px-6 py-5 text-center border-r border-zinc-100 text-zinc-500">{emp.half_day || '-'}</td>
                                    <td className="px-6 py-5 border-r border-zinc-100 text-black">{emp.phone || '-'}</td>
                                    <td className="px-6 py-5 border-r border-zinc-100 text-zinc-500 uppercase">{emp.position || '-'}</td>
                                    <td className="px-6 py-5 border-r border-zinc-100 text-zinc-500 uppercase">{emp.department || '-'}</td>
                                    <td className="px-6 py-5 border-r border-zinc-100 text-black">{emp.cnic || '-'}</td>
                                    <td className="px-6 py-5 text-center border-r border-zinc-100 tabular-nums text-black font-black">{formatTime(emp.entry_time)}</td>
                                    <td className="px-6 py-5 text-center border-r border-zinc-100 tabular-nums text-black font-black">{formatTime(emp.exit_time)}</td>
                                    <td className="px-6 py-5 text-center border-r border-zinc-100">
                                        <span className="text-[10px] font-black text-amber-600">{emp.late_summary}</span>
                                    </td>
                                    <td className="px-6 py-5 text-center border-r border-zinc-100 tabular-nums text-zinc-500">{formatTime(emp.break_in)}</td>
                                    <td className="px-6 py-5 text-center border-r border-zinc-100 tabular-nums text-zinc-500">{formatTime(emp.break_off)}</td>
                                    <td className="px-6 py-5 border-r border-zinc-100 uppercase text-black font-black">{emp.shift || '-'}</td>
                                    <td className="px-6 py-5 border-r border-zinc-100 text-zinc-400 lowercase">{emp.email}</td>
                                    <td className="px-6 py-5 text-center border-r border-zinc-100">
                                        <Badge variant={emp.dressing === 'casual' ? 'black' : 'slate'}>
                                            {emp.dressing === 'casual' ? 'YES' : 'NO'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <Badge variant={emp.dressing === 'formal' ? 'black' : 'slate'}>
                                            {emp.dressing === 'formal' ? 'YES' : 'NO'}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Registry Override">
                {editingProfile && (
                    <div className="space-y-6">
                        <Input label="Full Name" value={editingProfile.full_name} onChange={(e: any) => setEditingProfile({ ...editingProfile, full_name: e.target.value })} />
                        <Input label="Position" value={editingProfile.position} onChange={(e: any) => setEditingProfile({ ...editingProfile, position: e.target.value })} />
                        <PrimaryButton onClick={async () => {
                            setIsSaving(true);
                            try {
                                const res = await fetch('/api/users', {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ userId: editingProfile._id, updates: { full_name: editingProfile.full_name, position: editingProfile.position } })
                                });
                                if (res.ok) {
                                    toast.success("Updated");
                                    fetchData();
                                    setShowEditModal(false);
                                }
                            } finally {
                                setIsSaving(false);
                            }
                        }} disabled={isSaving} className="w-full">
                            {isSaving ? 'Syncing...' : 'Update Base Records'}
                        </PrimaryButton>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminDashboard;
