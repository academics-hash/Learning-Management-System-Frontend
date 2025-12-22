"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    ArrowLeft,
    ArrowUpRight,
    Monitor,
    Brain,
    Database,
    Search,
    Smartphone,
    Shield,
    Palette,
    Layers,
    Clock,
    Zap
} from 'lucide-react';

const icons = {
    "mern-stack": <Monitor className="w-6 h-6" />,
    "python-full-stack": <Layers className="w-6 h-6" />,
    "ai-ml": <Brain className="w-6 h-6" />,
    "data-science": <Database className="w-6 h-6" />,
    "data-analytics": <Zap className="w-6 h-6" />,
    "digital-marketing": <Search className="w-6 h-6" />,
    "software-testing": <Shield className="w-6 h-6" />,
    "ui-ux": <Palette className="w-6 h-6" />,
    "flutter": <Smartphone className="w-6 h-6" />
};

export default function ProgramsClient({ programsData }) {
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from(".page-title", {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power3.out"
        })
            .from(".program-card", {
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.5");
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-jost pb-32">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Navigation Bar */}
            <nav className="relative z-50 px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
                <Link href="/" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-pink-500/20 group-hover:border-pink-500/50 transition-all duration-300">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span>Back to Home</span>
                </Link>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12">
                <div className="page-title space-y-6 text-center mb-24">
                    <h1 className="text-6xl md:text-8xl font-lexend font-bold tracking-tighter">
                        EXPLORE OUR <br />
                        <span className="text-pink-600">PROGRAMS</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Future-proof your career with our industry-leading certification programs.
                        Designed by experts, built for the future.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(programsData).map(([slug, program], index) => (
                        <Link
                            key={slug}
                            href={`/programs/${slug}`}
                            className="program-card group relative block h-full"
                        >
                            <div className="relative h-full p-8 rounded-[32px] bg-white/5 border border-white/10 overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-pink-500/50 hover:-translate-y-2">
                                {/* Gradient Background on Hover */}
                                <div className="absolute inset-0 bg-linear-to-br from-pink-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 space-y-6 flex flex-col h-full">
                                    <div className="flex justify-between items-start">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-pink-500 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all duration-500">
                                            {icons[slug] || <Layers className="w-6 h-6" />}
                                        </div>
                                        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                                            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-lexend font-bold leading-tight group-hover:text-pink-500 transition-colors duration-300">
                                            {program.title}
                                        </h3>
                                        <p className="text-gray-400 line-clamp-2">
                                            {program.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/10">
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            {program.duration}
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-xs font-bold uppercase tracking-widest border border-pink-500/20">
                                            {program.level}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
