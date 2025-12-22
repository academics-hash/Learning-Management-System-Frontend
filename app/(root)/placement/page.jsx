"use client";
import React from 'react';
import Placement from '../compoents/Placement';
import { ArrowLeft, Sparkles, Trophy, Target, Globe, Award, Zap } from 'lucide-react';
import Link from 'next/link';

import TalkToExpertModal from '@/components/TalkToExpertModal';

const PlacementPage = () => {
    const [isExpertModalOpen, setIsExpertModalOpen] = React.useState(false);

    return (
        <div className="min-h-screen mt-12 bg-[#FDFCFD] selection:bg-[#DC5178]/20 selection:text-[#DC5178]">
            <TalkToExpertModal isOpen={isExpertModalOpen} setIsOpen={setIsExpertModalOpen} />
            {/* --- Advanced Design System: Background --- */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Modern Mesh Gradients */}
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-linear-to-br from-[#DC5178]/10 to-transparent rounded-full blur-[140px] opacity-60" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-linear-to-tr from-blue-500/5 to-transparent rounded-full blur-[120px] opacity-40" />

                {/* Subtle Grid Pattern for Technical Feel */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            {/* --- Futuristic Navigation Bar --- */}
            <nav className="relative z-50 max-w-[1500px] mx-auto px-6 pt-10">
                <Link
                    href="/"
                    className="group flex items-center gap-3 text-slate-500 hover:text-[#DC5178] transition-all duration-500 w-fit"
                >
                    <div className="relative p-3 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden group-hover:border-[#DC5178]/40 group-hover:shadow-[#DC5178]/10 transition-all">
                        <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-linear-to-br from-[#DC5178]/0 to-[#DC5178]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-lexend font-bold text-[10px] uppercase tracking-[0.2em]">Return</span>
                        <span className="font-jost text-sm font-semibold text-slate-900">Back to Hub</span>
                    </div>
                </Link>
            </nav>

            {/* --- Hero Section: High Impact Typography --- */}
            <main className="relative z-10 max-w-[1500px] mx-auto px-6 pt-20 pb-16 text-center">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 mb-10 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#DC5178]/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    <Sparkles size={14} className="text-[#DC5178]" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold font-lexend mt-0.5">Global Talent Network</span>
                </div>

                <h1 className="text-6xl md:text-9xl font-lexend font-bold text-slate-900 mb-8 tracking-tighter leading-[0.9] perspective-1000">
                    Shattering <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-[#DC5178] via-[#EF92AE] to-[#DC5178] bg-size-[200%_auto] animate-[gradient_4s_linear_infinite]">Boundaries</span>
                </h1>

                <p className="text-slate-500 text-lg md:text-2xl max-w-2xl mx-auto font-jost leading-relaxed font-medium">
                    Our alumni are architecting the future at the world&apos;s most innovative tech giants. Witness the evolution of talent into leadership.
                </p>

                {/* Performance Metrics: Transparent Modernity */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-20 max-w-7xl mx-auto">
                    {[
                        { icon: Globe, label: "Global Reach", value: "30+ Nations" },
                        { icon: Trophy, label: "Success Rate", value: "98.2%" },
                        { icon: Award, label: "Avg. Hike", value: "140%" },
                        { icon: Zap, label: "Hiring Partners", value: "500+" }
                    ].map((stat, i) => (
                        <div key={i} className="flex-1 min-w-[200px] p-8 rounded-[40px] bg-white/40 backdrop-blur-xl border border-white shadow-[0_8px_32px_rgba(0,0,0,0.02)] transition-all hover:translate-y-[-8px] hover:shadow-[0_20px_48px_rgba(220,81,120,0.08)] group/stat">
                            <stat.icon size={24} className="text-[#DC5178] mb-4 group-hover/stat:rotate-12 transition-transform" />
                            <div className="text-3xl font-bold font-lexend text-slate-900 mb-1 tracking-tight">{stat.value}</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black font-lexend">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </main>

            {/* --- The Placement Gallery: Visual Contrast --- */}
            <div className="py-24 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="max-w-[1500px] mx-auto px-6 mb-16 text-center md:text-left">
                        <h2 className="text-white text-3xl font-lexend font-bold opacity-0 invisible h-0">Placement Gallery</h2>
                    </div>
                    {/* The component already has its own dark background, radius and internal padding */}
                    <Placement />
                </div>
            </div>

            {/* --- Premium Conversion Section --- */}
            <div className="max-w-[1500px] mx-auto px-6 pb-40 pt-20">
                <div className="relative p-10 md:p-24 rounded-[60px] md:rounded-[100px] bg-white border border-slate-100 shadow-[20px_40px_80px_rgba(0,0,0,0.04)] text-center overflow-hidden group">
                    {/* Architectural Detail: Light Ribbons */}
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#DC5178]/5 rounded-full blur-3xl group-hover:bg-[#DC5178]/10 transition-colors duration-1000" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-1000" />

                    <div className="relative z-10">
                        <div className="w-20 h-20 rounded-[30%] bg-[#DC5178] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-[#DC5178]/30 rotate-12 group-hover:rotate-0 transition-all duration-700">
                            <Target className="text-white w-10 h-10" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-lexend font-bold text-slate-900 mb-6 tracking-tighter leading-none">
                            Your Journey <br /> <span className="text-[#DC5178]">Starts Here</span>
                        </h2>

                        <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto font-jost font-medium leading-relaxed">
                            Stop spectating and start creating. Our roadmap is designed to transform potential into professional excellence.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                            <Link
                                href="/programs"
                                className="group flex items-center gap-3 px-10 py-5 rounded-full bg-slate-900 text-white font-bold font-lexend transition-all shadow-xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1 active:scale-95 text-base"
                            >
                                <span>Dive into Programs</span>
                                <Zap className="w-5 h-5 text-[#DC5178] group-hover:animate-bounce" />
                            </Link>
                            <button
                                onClick={() => setIsExpertModalOpen(true)}
                                className="px-10 py-5 rounded-full bg-white border border-slate-200 text-slate-900 font-bold font-lexend hover:border-[#DC5178]/30 transition-all hover:bg-slate-50 active:scale-95 text-base"
                            >
                                Talk to Expert
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Animations for Futurisitic Polish */}
            <style jsx>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </div>
    );
};

export default PlacementPage;
