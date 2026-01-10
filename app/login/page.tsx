'use client';

import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link
                    href="/"
                    className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors mb-8 group"
                >
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Terminal
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
                        Login
                    </h1>
                    <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        Authorization Required // Personnel Only
                    </p>
                </div>

                <div className="bg-zinc-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-zinc-200/50">
                    <LoginForm />
                </div>

                <p className="mt-12 text-center text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed px-8">
                    Authorized access is monitored and logged. Unauthorized attempts will be reported to the IT security department immediately.
                </p>
            </div>
        </main>
    );
}
