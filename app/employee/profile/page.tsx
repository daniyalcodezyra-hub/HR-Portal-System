'use client';

import React, { useState, useEffect } from 'react';
import {
    User, Briefcase, Mail, Phone, Shield, MapPin, Loader2, Save, X, Edit2, Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

const Profile: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<any>({});

    useEffect(() => {
        if (user) {
            setEditedProfile({ ...user });
        }
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?._id,
                    updates: {
                        full_name: editedProfile.full_name,
                        phone: editedProfile.phone,
                    }
                })
            });

            if (res.ok) {
                toast.success('Profile updated');
                await refreshUser();
                setIsEditing(false);
            } else {
                toast.error('Update failed');
            }
        } catch (error) {
            toast.error('Process error');
        } finally {
            setLoading(false);
        }
    };

    if (!user && !loading) return null;

    const sections = [
        {
            title: 'Personal Identity',
            items: [
                { label: 'Legal Name', value: user?.full_name, icon: <User size={16} />, field: 'full_name', editable: true },
                { label: 'Official Email', value: user?.email, icon: <Mail size={16} />, field: 'email', editable: false },
                { label: 'Contact Number', value: user?.phone || 'Not provided', icon: <Phone size={16} />, field: 'phone', editable: true },
            ]
        },
        {
            title: 'Operational Detail',
            items: [
                { label: 'Role Designation', value: user?.role?.toUpperCase() || 'UNASSIGNED', icon: <Briefcase size={16} />, field: 'role', editable: false },
                { label: 'Assigned Shift', value: user?.shift || 'GENERAL', icon: <Clock size={16} />, field: 'shift', editable: false },
                { label: 'Position', value: user?.position || 'GENERAL', icon: <MapPin size={16} />, field: 'position', editable: false },
                { label: 'System ID', value: user?._id?.substring(0, 16).toUpperCase() + '...', icon: <Shield size={16} />, field: 'id', editable: false },
            ]
        }
    ];

    return (
        <div className="space-y-12 pb-10">
            <div className="bg-black rounded-[3rem] p-10 sm:p-20 text-white shadow-2xl relative overflow-hidden group border border-zinc-800">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-900 rounded-full blur-[150px] -mr-64 -mt-64"></div>
                {isEditing ? (
                    <div className="absolute top-10 right-10 flex gap-3 z-20">
                        <button onClick={() => setIsEditing(false)} className="p-4 bg-zinc-800 text-white rounded-full hover:bg-zinc-700 transition-all"><X size={20} /></button>
                        <button onClick={handleSave} className="p-4 bg-white text-black rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2 px-6">
                            <Save size={20} /> <span className="text-[10px] font-black uppercase">Commit</span>
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="absolute top-10 right-10 p-5 bg-white text-black rounded-full hover:bg-zinc-200 transition-all shadow-2xl z-20">
                        <Edit2 size={20} />
                    </button>
                )}

                <div className="flex flex-col items-center sm:flex-row sm:items-end gap-14 relative z-10">
                    <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-[3rem] border-4 border-zinc-800 shadow-2xl overflow-hidden bg-zinc-900 flex items-center justify-center text-6xl font-black">
                        {user?.full_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4">{user?.full_name}</h1>
                        <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px] mb-10 opacity-80">Operational Unit Member</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-white rounded-[3rem] p-10 sm:p-16 shadow-sm border border-zinc-100">
                        <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-10 flex items-center gap-4">
                            {section.title}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            {section.items.map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-3">{item.icon} {item.label}</p>
                                    {isEditing && item.editable ? (
                                        <input
                                            type="text"
                                            className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl px-4 py-2 text-sm font-black text-black outline-none focus:border-black transition-all"
                                            value={editedProfile[item.field!] || ''}
                                            onChange={(e) => setEditedProfile({ ...editedProfile, [item.field!]: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-sm font-black text-black uppercase truncate tracking-tight">{item.value || 'NOT SPECIFIED'}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
