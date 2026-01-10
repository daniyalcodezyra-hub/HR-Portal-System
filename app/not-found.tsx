'use client';

import React from 'react';
import Link from 'next/link';
import { MoveRight, Home, ShieldAlert } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center select-none">
            {/* Background Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.03] pointer-events-none">
                <h2 className="text-[30rem] font-black italic select-none">404</h2>
            </div>

            <div className="space-y-8 max-w-2xl mx-auto">
                {/* Icon Badge */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-50 border border-slate-100 shadow-xl mb-4 animate-bounce">
                    <ShieldAlert size={32} className="text-black" />
                </div>

                {/* Main Heading */}
                <div className="space-y-2">
                    <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
                        Lost in <br />
                        <span className="text-zinc-300">Transit</span>
                    </h1>
                    <p className="text-zinc-400 font-bold text-[10px] md:text-sm uppercase tracking-[0.4em] mt-4">
                        Status 404 // Resource Not Found
                    </p>
                </div>

                {/* Description */}
                <p className="text-zinc-500 font-medium text-lg leading-relaxed max-w-md mx-auto">
                    The requested URL does not exist or has been relocated within the enterprise server infrastructure.
                </p>

                {/* Call to Action */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
                    <Link
                        href="/"
                        className="group relative px-12 py-5 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3"
                    >
                        <Home size={18} />
                        Return Home
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="px-12 py-5 border-2 border-slate-100 rounded-full font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:border-black hover:text-black transition-all flex items-center gap-3 group"
                    >
                        <MoveRight size={18} className="rotate-180 group-hover:-translate-x-2 transition-transform" />
                        Go Back
                    </button>
                </div>

                {/* Footer Info */}
                <div className="pt-20 border-t border-slate-100">
                    <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale pointer-events-none">
                        <span className="text-[10px] font-black uppercase tracking-widest">Enterprise HR</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Portal v2.0</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Secure Node</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
