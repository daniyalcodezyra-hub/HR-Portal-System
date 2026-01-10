'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Calendar, Filter, Loader2, RefreshCcw, Info, Camera, CheckCircle2 } from 'lucide-react';
import { Card, Badge, PrimaryButton } from '@/components/SharedUI';
import { toast } from 'react-toastify';

const Logs: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const fetchData = async () => {
        setLoading(true);
        try {
            const [logsRes, usersRes] = await Promise.all([
                fetch('/api/attendance'),
                fetch('/api/users')
            ]);

            const logsData = await logsRes.json();
            const usersData = await usersRes.json();

            if (logsRes.ok) setLogs(logsData || []);
            if (usersRes.ok) setUsers(usersData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

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

    // Filter logs for selected month/year
    const monthlyLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getMonth() === selectedMonth && logDate.getFullYear() === selectedYear;
    });

    // Aggregate data per user
    const userSummary = users.map(user => {
        const userLogs = monthlyLogs.filter(log => log.user?._id === user._id || log.user === user._id);
        const present = userLogs.filter(l => l.status === 'present').length;
        const late = userLogs.filter(l => l.status === 'late').length;
        const leave = userLogs.filter(l => l.status === 'leave').length;
        const absent = 26 - (present + late + leave); // Assuming 26 work days

        return {
            ...user,
            present,
            late,
            leave,
            absent: absent > 0 ? absent : 0,
            logs: userLogs
        };
    }).filter(u => u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-black" size={48} />
                    <p className="text-zinc-400 font-black uppercase text-[10px] tracking-[0.4em]">Aggregating Monthly Intelligence...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-50/50 p-8 rounded-[3rem] border border-zinc-100">
                <div>
                    <h1 className="text-4xl font-black text-black tracking-tighter leading-none mb-2">Monthly Intelligence</h1>
                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em]">Aggregated Workforce Performance Data</p>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex bg-white rounded-2xl border border-zinc-200 p-1">
                        {months.map((m, i) => (
                            <button
                                key={m}
                                onClick={() => setSelectedMonth(i)}
                                className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${selectedMonth === i ? 'bg-black text-white' : 'text-zinc-400 hover:text-black'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Card className="!p-0 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-6 bg-zinc-50/20">
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                        <input
                            type="text"
                            placeholder="Query by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-black transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="black">Month: {months[selectedMonth]} {selectedYear}</Badge>
                        <button onClick={fetchData} className="p-4 bg-white border border-zinc-100 rounded-2xl hover:text-black transition-all"><RefreshCcw size={18} /></button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap min-w-[1200px]">
                        <thead className="bg-zinc-50/50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Agent</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Summary (P|L|A|V)</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Protocol Timings</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Expected Break</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {userSummary.map((user) => (
                                <tr key={user._id} className="hover:bg-zinc-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm">
                                                {user.full_name?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-black tracking-tight leading-none mb-1 text-sm uppercase">{user.full_name}</p>
                                                <p className="text-[9px] text-zinc-400 font-black tracking-widest uppercase">{user.position}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Badge variant="emerald">{user.present}P</Badge>
                                            <Badge variant="amber">{user.late}L</Badge>
                                            <Badge variant="rose">{user.absent}A</Badge>
                                            <Badge variant="indigo">{user.leave}V</Badge>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <p className="font-black text-black text-xs uppercase tracking-tighter">
                                            {formatTime(user.entry_time)} - {formatTime(user.exit_time)}
                                        </p>
                                        <p className="text-[8px] text-zinc-400 font-black uppercase tracking-widest">{user.shift}</p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <p className="text-[10px] font-black text-zinc-500">
                                            {formatTime(user.break_in)} - {formatTime(user.break_off)}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col gap-1 items-center">
                                            <Badge variant="slate">PKR {user.salary}K</Badge>
                                            <span className="text-[8px] font-black text-zinc-300 uppercase">{user.phone}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Logs;
