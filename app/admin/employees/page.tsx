'use client';

import React, { useState, useEffect } from 'react';
import {
    Search, Plus, Filter, Edit2, User,
    Mail, Phone, Briefcase, Clock,
    Save, Trash2, Loader2, ChevronDown, ChevronUp
} from 'lucide-react';
import { Card, Badge, SectionHeader, PrimaryButton, Modal, Input, Select } from '@/components/SharedUI';
import { toast } from 'react-toastify';

const Employees: React.FC = () => {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            if (res.ok) {
                setProfiles(data || []);
            }
        } catch (error) {
            // console.error('Error fetching profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleEdit = (profile: any) => {
        setEditingProfile({ ...profile });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this staff record?")) {
            try {
                const res = await fetch(`/api/users?userId=${id}`, {
                    method: 'DELETE'
                });

                if (res.ok) {
                    toast.success("Staff record removed");
                    fetchProfiles();
                } else {
                    toast.error("Failed to delete");
                }
            } catch (error) {
                toast.error("Process error");
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProfile && editingProfile._id) {
            try {
                const res = await fetch('/api/users', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: editingProfile._id,
                        updates: {
                            full_name: editingProfile.full_name,
                            role: editingProfile.role,
                            shift: editingProfile.shift,
                            department: editingProfile.department,
                            phone: editingProfile.phone,
                            cnic: editingProfile.cnic,
                            position: editingProfile.position,
                            salary: editingProfile.salary,
                            entry_time: editingProfile.entry_time,
                            exit_time: editingProfile.exit_time,
                            break_in: editingProfile.break_in,
                            break_off: editingProfile.break_off,
                            annual_leaves: editingProfile.annual_leaves,
                        }
                    })
                });

                if (res.ok) {
                    toast.success("Profile updated");
                    fetchProfiles();
                    setIsModalOpen(false);
                } else {
                    toast.error("Update failed");
                }
            } catch (error) {
                toast.error("Process error");
            }
        }
    };

    const handleChange = (field: string, value: any) => {
        if (editingProfile) {
            setEditingProfile({ ...editingProfile, [field]: value });
        }
    };

    const formatTime = (timeStr: any) => {
        if (!timeStr || timeStr === '-' || timeStr === 'NONE') return '-';
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

    const filteredProfiles = profiles.filter(p =>
        p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cnic?.includes(searchTerm)
    );

    if (loading && profiles.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-black" size={48} />
                    <p className="text-zinc-400 font-black uppercase text-[10px] tracking-[0.4em]">Querying Workforce...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-black tracking-tighter leading-none mb-2">Staff Registry</h1>
                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em]">Detailed Resource Intelligence</p>
                </div>
            </div>

            <Card className="!p-0 overflow-hidden shadow-2xl border border-zinc-100">
                <div className="p-8 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-zinc-50/20">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                        <input
                            type="text"
                            placeholder="Query database (Name, CNIC, Dept)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 bg-white border border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-black transition-all"
                        />
                    </div>
                    <button onClick={fetchProfiles} className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-zinc-500 border border-zinc-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-black transition-all shadow-sm">
                        <Filter size={16} /> Refresh
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead>
                            <tr className="bg-zinc-50/50 border-b border-zinc-100">
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Agent Detail</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Identity (CNIC)</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Payroll (PKR)</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Shift/Time</th>
                                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Break Protocol</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredProfiles.map((emp) => (
                                <tr key={emp._id} className="hover:bg-zinc-50/30 transition-colors group text-xs">
                                    <td className="px-6 py-6 min-w-[250px]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black">
                                                {emp.full_name?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-black tracking-tight leading-none mb-1 text-sm uppercase">{emp.full_name}</p>
                                                <p className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">{emp.position}</p>
                                                <p className="text-[9px] text-zinc-400 font-bold tracking-widest">{emp.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <p className="font-black text-black">{emp.cnic || 'NOT-SET'}</p>
                                        <p className="text-[9px] text-zinc-400 font-bold tracking-widest">{emp.phone || 'NO-PH'}</p>
                                    </td>
                                    <td className="px-6 py-6 text-center font-black">
                                        <p>Rs {emp.salary || '0'}</p>
                                        <Badge variant="slate">{emp.department?.toUpperCase()}</Badge>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <p className="font-black text-black uppercase tracking-widest mb-1">{emp.shift}</p>
                                        <p className="text-[10px] font-bold text-zinc-400">{formatTime(emp.entry_time)} - {formatTime(emp.exit_time)}</p>
                                    </td>
                                    <td className="px-6 py-6 text-center font-black text-[10px] text-zinc-400">
                                        {formatTime(emp.break_in)} - {formatTime(emp.break_off)}
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => handleEdit(emp)} className="p-2.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-all"><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(emp._id)} className="p-2.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registry Override">
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Full Name" value={editingProfile?.full_name || ""} onChange={(e: any) => handleChange("full_name", e.target.value)} icon={User} />
                    <Input label="Job Title / Position" value={editingProfile?.position || ""} onChange={(e: any) => handleChange("position", e.target.value)} icon={Briefcase} />
                    <Input label="Primary Mobile" value={editingProfile?.phone || ""} onChange={(e: any) => handleChange("phone", e.target.value)} icon={Phone} />
                    <Input label="CNIC Number" value={editingProfile?.cnic || ""} onChange={(e: any) => handleChange("cnic", e.target.value)} icon={CreditCard} />
                    <Input label="Department" value={editingProfile?.department || ""} onChange={(e: any) => handleChange("department", e.target.value)} icon={Briefcase} />
                    <Input label="Monthly Salary (PKR)" value={editingProfile?.salary || ""} onChange={(e: any) => handleChange("salary", e.target.value)} icon={DollarSign} />
                    <Input label="Annual Leaves Allowance" type="number" value={editingProfile?.annual_leaves || 20} onChange={(e: any) => handleChange("annual_leaves", parseInt(e.target.value))} icon={Calendar} />

                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <Input label="Entry Time" type="time" value={editingProfile?.entry_time || ""} onChange={(e: any) => handleChange("entry_time", e.target.value)} icon={Clock} />
                        <Input label="Exit Time" type="time" value={editingProfile?.exit_time || ""} onChange={(e: any) => handleChange("exit_time", e.target.value)} icon={Clock} />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <Input label="Break Start" type="time" value={editingProfile?.break_in || ""} onChange={(e: any) => handleChange("break_in", e.target.value)} icon={Clock} />
                        <Input label="Break End" type="time" value={editingProfile?.break_off || ""} onChange={(e: any) => handleChange("break_off", e.target.value)} icon={Clock} />
                    </div>

                    <Select label="Current Shift" value={editingProfile?.shift || "Day Shift"} onChange={(e: any) => handleChange("shift", e.target.value)} options={["Day Shift", "Night Shift"]} />
                    <Select label="System Role" value={editingProfile?.role || "employee"} onChange={(e: any) => handleChange("role", e.target.value)} options={["admin", "employee"]} />

                    <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                        <PrimaryButton type="submit" icon={Save}>Update Records</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Employees;
