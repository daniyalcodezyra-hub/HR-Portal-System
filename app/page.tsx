'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ShieldCheck, Clock, ArrowRight,
    Globe, Award, Zap,
    UserCheck, Terminal, Heart, Smartphone, ChevronRight, Download,
    Menu, X, ArrowUp
} from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '@/contexts/AuthContext';

const Landing: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { isInstallable, handleInstallClick } = usePWAInstall();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic',
            offset: 50,
        });

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const sops = [
        {
            category: "Attendance Protocol",
            icon: <Clock size={24} />,
            rules: [
                "Standard shift starts at 09:00 AM prompt.",
                "Strict 10-minute grace period (09:10 AM limit).",
                "Biometric verification required for all staff.",
                "Geofencing active for remote-hub employees."
            ]
        },
        {
            category: "Professional Standards",
            icon: <ShieldCheck size={24} />,
            rules: [
                "Monochrome/Business formal attire required.",
                "Zero-tolerance policy for code of conduct breaches.",
                "Digital presence required on internal tools.",
                "Client confidentiality is a non-negotiable asset."
            ]
        },
        {
            category: "Resource Management",
            icon: <Heart size={24} />,
            rules: [
                "Leave quota: 15 Annual, 10 Casual days.",
                "Approval required 48 hours in advance.",
                "System records uninformed absences automatically.",
                "Health and wellness insurance for all members."
            ]
        }
    ];

    const features = [
        { title: "Neural Biometrics", desc: "Advanced facial recognition and identity verification.", icon: <UserCheck /> },
        { title: "Live Operations", desc: "Real-time workforce heatmaps and metrics.", icon: <Zap /> },
        { title: "Global Nexus", desc: "Multi-regional compliance and taxation logic.", icon: <Globe /> },
        { title: "Remote Core", desc: "Seamless switching for hybrid workspace models.", icon: <Terminal /> }
    ];

    return (
        <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 glass-effect z-[100] border-b border-zinc-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between bg-white/80 backdrop-blur-md">
                    {/* Logo Section */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 sm:gap-4 group cursor-pointer shrink-0"
                    >
                        <div className="w-9 h-9 sm:w-11 sm:h-11 bg-black rounded-full flex items-center justify-center text-white font-black text-base sm:text-lg transition-transform duration-500">
                            C
                        </div>
                        <span className="text-lg sm:text-xl font-black tracking-tighter uppercase whitespace-nowrap">Codezyra</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-12">
                        {['SOP Standards', 'Capabilities', 'Mission'].map((item) => (
                            <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-[10px] font-black text-zinc-400 hover:text-black uppercase tracking-[0.3em] transition-all">
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section: Action Buttons */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={() => {
                                if (isInstallable) {
                                    handleInstallClick();
                                } else {
                                    alert('App installation is not currently available.');
                                }
                            }}
                            className="hidden md:flex items-center gap-2 px-6 py-2 border border-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
                        >
                            <Download size={14} /> Install App
                        </button>

                        {user ? (
                            <Link href={user.role === 'admin' ? '/admin' : '/employee'} className="px-5 sm:px-10 py-3 sm:py-4 bg-black text-white rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-2xl hover:bg-zinc-800 transition-all active:scale-95 whitespace-nowrap">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:block px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-all">
                                    Login
                                </Link>
                                <Link href="/signup" className="px-5 sm:px-10 py-3 sm:py-4 bg-black text-white rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-2xl hover:bg-zinc-800 transition-all active:scale-95 whitespace-nowrap">
                                    Signup
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-black hover:bg-zinc-50 rounded-xl transition-all"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Flyout Menu */}
                <div className={`
          lg:hidden fixed inset-x-0 top-[80px] sm:top-[96px] bg-white border-b border-zinc-100 shadow-2xl transition-all duration-500 ease-in-out transform
          ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
        `}>
                    <div className="p-6 flex flex-col gap-6">
                        {['SOP Standards', 'Capabilities', 'Mission'].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-xs font-black text-zinc-400 hover:text-black uppercase tracking-[0.3em] transition-all border-b border-zinc-50 pb-4"
                            >
                                {item}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-4 mt-2">
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-xs font-black text-black uppercase tracking-[0.2em]"
                            >
                                Login to Portal
                            </Link>
                            {isInstallable && (
                                <button
                                    onClick={() => { handleInstallClick(); setIsMobileMenuOpen(false); }}
                                    className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-[0.2em]"
                                >
                                    <Download size={16} /> Install Native App
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="pt-32 sm:pt-48 md:pt-60 pb-20 sm:pb-32 md:pb-40 px-6 bg-white relative">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div data-aos="fade-down" className="px-6 py-2 border border-zinc-200 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] mb-12">
                        Enterprise Excellence Platform
                    </div>
                    <h1 data-aos="fade-up" data-aos-delay="100" className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter mb-8 sm:mb-12 uppercase px-4">
                        Future <br /> <span className="text-zinc-400">Workforce.</span>
                    </h1>
                    <p data-aos="fade-up" data-aos-delay="200" className="text-sm sm:text-base md:text-lg text-zinc-600 max-w-xl mb-12 sm:mb-16 font-medium leading-relaxed px-4">
                        High-fidelity operational control. Codezyra provides the infrastructure for precision human resource management and attendance tracking.
                    </p>
                    <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                        <Link href="/signup" className="w-full sm:w-auto px-10 sm:px-16 py-6 sm:py-7 bg-black text-white rounded-full font-black text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] shadow-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 active:scale-95">
                            Onboard Staff <ArrowRight size={20} />
                        </Link>
                        <Link href="#sop-standards" className="w-full sm:w-auto px-10 sm:px-16 py-6 sm:py-7 bg-white text-black border border-zinc-200 rounded-full font-black text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-zinc-50 transition-all text-center">
                            Read SOPs
                        </Link>
                    </div>
                </div>
            </header>

            {/* Rest of the landing page content remains identical but using standard HTML tags/Next.js components */}
            {/* (Truncated for brevity, I will include the full content in the write_to_file call) */}

            {/* Stats Divider */}
            <section className="py-20 border-y border-zinc-100 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                    {[
                        { label: 'Uptime Reliability', value: '99.9%' },
                        { label: 'Security Level', value: 'CZ-Alpha' },
                        { label: 'Compliance', value: 'ISO-27K' },
                        { label: 'Portal Speed', value: '0.2s' }
                    ].map((stat, i) => (
                        <div key={i} className="text-center" data-aos="zoom-in" data-aos-delay={i * 100}>
                            <p className="text-2xl sm:text-4xl font-black mb-1">{stat.value}</p>
                            <p className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SOP Section */}
            <section id="sop-standards" className="py-40 bg-zinc-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
                        <div className="max-w-2xl" data-aos="fade-right">
                            <p className="text-[9px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] sm:tracking-[0.4em] mb-4 sm:mb-6">Standard Operating Procedures</p>
                            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-4 sm:mb-0 px-2">The Codezyra <br /> Standard.</h2>
                        </div>
                        <p className="text-zinc-600 font-medium max-w-xs text-right hidden md:block" data-aos="fade-left">
                            Rules and protocols that define operational excellence within our ecosystem.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {sops.map((item, i) => (
                            <div key={i} className="bg-white p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-zinc-200 hover:border-black transition-all group" data-aos="fade-up" data-aos-delay={i * 100}>
                                <div className="w-11 h-11 sm:w-13 sm:h-13 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-10 text-white transition-transform group-hover:-rotate-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">{item.category}</h3>
                                <ul className="space-y-6">
                                    {item.rules.map((rule, idx) => (
                                        <li key={idx} className="flex gap-4 items-start text-[13px] text-zinc-600 font-bold leading-relaxed">
                                            <div className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 flex-shrink-0"></div>
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Capabilities Section */}
            <section id="capabilities" className="py-40 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
                        <div>
                            <h2 className="text-6xl font-black uppercase tracking-tighter mb-8 leading-none">Core <br /> Capabilities</h2>
                            <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-md">
                                We leverage high-performance logic to automate resource governance, so you can focus on scale.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((f, i) => (
                                <div key={i} className="p-6 sm:p-8 rounded-[1.25rem] sm:rounded-[2rem] border border-zinc-100 hover:bg-black hover:text-white transition-all group" data-aos="flip-up" data-aos-delay={i * 100}>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-zinc-800 transition-colors">
                                        <div className="group-hover:text-white transition-colors">{f.icon}</div>
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tighter mb-2">{f.title}</h3>
                                    <p className="text-xs text-zinc-600 group-hover:text-zinc-400 font-medium leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section id="mission" className="py-48 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent)]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                    < Award size={48} className="mb-6 sm:mb-8 opacity-30" />
                    <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8 sm:mb-12 px-4">Building <br /> Modern Infrastructure.</h2>
                    <p className="text-base sm:text-xl md:text-2xl text-zinc-400 max-w-4xl font-medium leading-relaxed mb-12 sm:mb-16 italic px-6">
                        "Our mission is to establish the global baseline for workforce transparency, ensuring every hour is respected and every achievement is documented."
                    </p>
                    <Link href="/signup" className="group px-16 py-7 bg-white text-black rounded-full font-black uppercase tracking-[0.3em] text-xs flex items-center gap-4 hover:bg-zinc-200 transition-all">
                        Begin Integration <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* PWA Section */}
            <section className="py-24 bg-zinc-50 mx-4 sm:mx-6 rounded-[2.5rem] mb-20 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-2xl border border-zinc-100 flex flex-col md:flex-row items-center gap-8 sm:gap-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                        <div className="w-28 h-28 sm:w-40 sm:h-40 bg-black rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl flex items-center justify-center shrink-0 relative z-10">
                            <span className="text-white text-4xl sm:text-6xl font-black">C</span>
                            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-[1.5rem] sm:rounded-t-[2rem]"></div>
                        </div>
                        <div className="flex-1 text-center md:text-left z-10">
                            <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tighter uppercase mb-2">Codezyra Portal</h2>
                            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">Codezyra Systems • Enterprise Utility</p>
                            <div className="flex items-center justify-center md:justify-start gap-6 sm:gap-10 mb-8 border-y border-zinc-50 py-4">
                                <div className="text-center md:text-left">
                                    <div className="flex items-center gap-1 justify-center md:justify-start font-black text-black">
                                        <span>4.9</span> <Award size={14} className="fill-black" />
                                    </div>
                                    <p className="text-[9px] text-zinc-400 uppercase tracking-wider">Rating</p>
                                </div>
                                <div className="w-px h-8 bg-zinc-100"></div>
                                <div className="text-center md:text-left">
                                    <p className="font-black text-black">2 MB</p>
                                    <p className="text-[9px] text-zinc-400 uppercase tracking-wider">Size</p>
                                </div>
                                <div className="w-px h-8 bg-zinc-100"></div>
                                <div className="text-center md:text-left">
                                    <p className="font-black text-black">4+</p>
                                    <p className="text-[9px] text-zinc-400 uppercase tracking-wider">Rated</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <button
                                    onClick={() => {
                                        if (isInstallable) {
                                            handleInstallClick();
                                        } else {
                                            alert('App installation is not available momentarily.');
                                        }
                                    }}
                                    className="px-10 py-4 bg-black text-white rounded-full font-black text-xs uppercase tracking-[0.1em] hover:bg-zinc-800 hover:scale-105 transition-all shadow-lg active:scale-95 flex items-center gap-3 w-full sm:w-auto justify-center"
                                >
                                    <Download size={18} /> Install Application
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 sm:py-32 bg-white border-t border-zinc-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24 mb-20 sm:mb-32">
                        <div className="max-w-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black">C</div>
                                <span className="text-2xl font-black tracking-tighter uppercase">Codezyra</span>
                            </div>
                            <p className="text-zinc-500 font-medium leading-relaxed mb-10">
                                Precision workforce management for the global digital economy. Built for performance, designed for scale.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-16 lg:gap-24">
                            {[
                                { title: 'Platform', links: ['Staff Portal', 'Analytics', 'Compliance', 'Security'] },
                                { title: 'Support', links: ['SOPs', 'Documentation', 'Contact', 'Terms'] },
                                { title: 'Company', links: ['About', 'Mission', 'Offices', 'Press'] }
                            ].map((group, i) => (
                                <div key={i}>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8">{group.title}</h4>
                                    <ul className="space-y-4">
                                        {group.links.map(link => (
                                            <li key={link}><Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-black transition-all">{link}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-zinc-400 text-[9px] font-black uppercase tracking-widest">
                            &copy; 2026 CODEZYRA SYSTEMS • ALL RIGHTS RESERVED
                        </p>
                    </div>
                </div>
            </footer>

            {/* WhatsApp Button */}
            <a
                href="https://wa.me/923342129678"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform hover:shadow-green-900/20"
            >
                <svg viewBox="0 0 24 24" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>

            {/* Scroll to Top */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-6 left-6 z-[100] w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-500 hover:bg-zinc-800 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
            >
                <ArrowUp size={24} />
            </button>
        </div>
    );
};

export default Landing;
