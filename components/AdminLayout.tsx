'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  RefreshCcw,
  LogOut,
  Search,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut, user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Today Summary', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { label: 'Staff Registry', icon: <Users size={20} />, path: '/admin/employees' },
    { label: 'Monthly Logs', icon: <RefreshCcw size={20} />, path: '/admin/logs' },
  ];

  return (
    <div className="flex min-h-screen bg-white selection:bg-black selection:text-white">
      {/* Sidebar Desktop Only */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 bg-white border-r border-zinc-100 z-50 w-28 flex-col justify-between">
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-6 flex flex-col items-center gap-6 min-h-[100px]">
            <Link
              href="/"
              className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-lg cursor-pointer hover:scale-105 transition-transform"
            >
              C
            </Link>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-4 flex flex-col items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                title={item.label}
                className={`w-full flex flex-col items-center justify-center gap-2 py-4 rounded-xl transition-all duration-300 ${pathname === item.path
                  ? 'bg-black text-white shadow-xl shadow-zinc-200'
                  : 'text-zinc-400 hover:text-black hover:bg-zinc-50'
                  }`}
              >
                <div className="shrink-0">{item.icon}</div>
                <span className="text-[9px] font-black uppercase tracking-widest text-center">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-zinc-50 flex flex-col items-center">
            <button
              onClick={signOut}
              title="Logout"
              className="w-full flex flex-col items-center justify-center gap-2 py-4 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
            >
              <div className="shrink-0"><LogOut size={20} /></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-center">Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:pl-28 transition-all duration-300">
        {/* Header */}
        <header className="h-20 lg:h-24 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black shrink-0">C</div>

            <div className="hidden md:flex items-center bg-zinc-50 px-5 py-3 rounded-full w-64 lg:w-80 border border-zinc-200 focus-within:border-black transition-colors">
              <Search size={16} className="text-zinc-400" />
              <input
                type="text"
                placeholder="Query database..."
                className="bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-widest ml-3 w-full text-black placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col text-right">
              <p className="text-[12px] font-black text-black leading-none uppercase tracking-tighter">
                {new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: false })} PKT
              </p>
              <p className="text-[8px] text-zinc-400 font-black uppercase tracking-widest mt-1">Operational Clock</p>
            </div>
            <div className="h-8 w-px bg-zinc-100 hidden sm:block"></div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-black leading-none uppercase tracking-tighter">{user?.full_name || 'Master Admin'}</p>
                <p className="text-[8px] text-zinc-400 font-black uppercase tracking-widest mt-1">{user?.role === 'admin' ? 'Super User' : 'Employee'}</p>
              </div>
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-black flex items-center justify-center font-black text-white text-xs shadow-xl shadow-zinc-200 shrink-0">
                {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'MA'}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
