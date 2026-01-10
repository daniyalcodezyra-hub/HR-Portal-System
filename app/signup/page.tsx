'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import SignupForm from '@/components/auth/SignupForm';

const Signup: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-white">
            <div className="w-full max-w-2xl">
                <div className="flex items-center justify-between mb-12">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-black group-hover:rotate-12 transition-transform">C</div>
                        <span className="text-2xl font-black text-black uppercase tracking-tighter">Codezyra</span>
                    </Link>
                    <Link href="/login" className="text-[10px] font-black text-zinc-400 hover:text-black uppercase tracking-widest flex items-center gap-2 transition-colors">
                        <ChevronLeft size={16} /> Login
                    </Link>
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="bg-zinc-50 px-8 py-6 border-b border-slate-100">
                        <h2 className="text-2xl font-black text-black tracking-tighter uppercase text-center">Employee Registration</h2>
                        <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest mt-2 text-center">Create Your Account</p>
                    </div>

                    <div className="p-8 md:p-16">
                        <SignupForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
