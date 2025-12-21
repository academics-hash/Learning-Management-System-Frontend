"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    BookOpen,
    AlertTriangle,
    Lightbulb,
    Briefcase,
    Clock,
    BarChart3,
    ArrowLeft,
    Monitor,
    Shield,
    Smartphone,
    Layers,
    Brain,
    Database,
    Search
} from 'lucide-react';
import Link from 'next/link';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ProgramDetailClient({ program }) {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const sectionsRef = useRef([]);

    useGSAP(() => {
        // Hero Animation
        const tl = gsap.timeline();
        tl.from(heroRef.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out"
        })
            .from(".hero-content > *", {
                opacity: 0,
                x: -30,
                stagger: 0.2,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.5")
            .from(".hero-image", {
                opacity: 0,
                scale: 0.8,
                duration: 1,
                ease: "back.out(1.7)"
            }, "-=1");

        // Section animations on scroll
        sectionsRef.current.forEach((section) => {
            if (!section) return;
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        // Floating icons animation
        gsap.to(".floating-icon", {
            y: "random(-20, 20)",
            x: "random(-10, 10)",
            rotation: "random(-15, 15)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }, { scope: containerRef });

    const getIcon = (title) => {
        const t = title.toLowerCase();
        if (t.includes('mern') || t.includes('web')) return <Monitor className="w-12 h-12 text-pink-500" />;
        if (t.includes('python') || t.includes('software')) return <Layers className="w-12 h-12 text-blue-500" />;
        if (t.includes('ai') || t.includes('machine')) return <Brain className="w-12 h-12 text-purple-500" />;
        if (t.includes('data science') || t.includes('analytics')) return <Database className="w-12 h-12 text-green-500" />;
        if (t.includes('marketing')) return <Search className="w-12 h-12 text-orange-500" />;
        if (t.includes('flutter')) return <Smartphone className="w-12 h-12 text-cyan-500" />;
        if (t.includes('ui') || t.includes('ux')) return <Lightbulb className="w-12 h-12 text-pink-400" />;
        if (t.includes('testing')) return <Shield className="w-12 h-12 text-red-500" />;
        return <BookOpen className="w-12 h-12 text-pink-500" />;
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-jost selection:bg-pink-500/30">
            {/* SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Course",
                        "name": program.title,
                        "description": program.description,
                        "provider": {
                            "@type": "Organization",
                            "name": "Stackup",
                            "sameAs": "https://stackup.com"
                        }
                    })
                }}
            />

            {/* Futuristic Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />
            </div>

            {/* Navigation Bar (Simple for details) */}
            <nav className="relative z-50 px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
                <Link href="/programs" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-pink-500/20 group-hover:border-pink-500/50 transition-all duration-300">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span>Back to Programs</span>
                </Link>
            </nav>

            <main className="relative z-10">
                {/* Hero Section */}
                <section ref={heroRef} className="px-6 pt-12 pb-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="hero-content flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                            {program.level} Level Program
                        </div>
                        <h1 className="text-5xl md:text-7xl font-lexend font-bold leading-tight">
                            {program.title.split(' ').map((word, i) => (
                                <span key={i} className={i === program.title.split(' ').length - 1 ? "text-pink-600" : ""}>{word} </span>
                            ))}
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                            {program.description}
                        </p>
                        <div className="flex flex-wrap gap-6 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 uppercase font-lexend tracking-widest text-[10px] text-gray-500">
                                    <Clock className="w-5 h-5 text-pink-500 mb-1" />
                                    Duration
                                    <div className="text-sm font-bold text-white mt-1">{program.duration}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 uppercase font-lexend tracking-widest text-[10px] text-gray-500">
                                    <BarChart3 className="w-5 h-5 text-blue-500 mb-1" />
                                    Job Potential
                                    <div className="text-sm font-bold text-white mt-1">High Intensity</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image flex-1 relative group w-full max-w-lg">
                        <div className="absolute inset-0 bg-pink-600/20 rounded-3xl blur-[40px] group-hover:blur-[60px] transition-all duration-500" />
                        <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 backdrop-blur-md">
                            <Image
                                src={program.image}
                                alt={program.title}
                                fill
                                className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Career Path</div>
                                    <div className="text-sm font-medium">{program.career}</div>
                                </div>
                            </div>
                        </div>
                        {/* Floating elements */}
                        <div className="floating-icon absolute -top-10 -right-10 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                            {getIcon(program.title)}
                        </div>
                    </div>
                </section>

                {/* Content Sections */}
                <div className="px-6 space-y-32 pb-32 max-w-7xl mx-auto">
                    {/* What you will study */}
                    <section ref={el => sectionsRef.current[0] = el} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="p-4 inline-flex rounded-2xl bg-pink-500/10 text-pink-500">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl font-lexend font-bold">What <span className="text-pink-600">to Study</span></h2>
                            <p className="text-gray-400 text-lg">
                                Our curriculum is carefully crafted to focus on the most industry-relevant technologies and concepts.
                            </p>
                        </div>
                        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                            {program.study.map((item, i) => (
                                <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-white/10 transition-all duration-300">
                                    <div className="flex gap-4">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-pink-500 group-hover:scale-150 transition-transform" />
                                        <p className="text-gray-300 font-medium">{item}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* How to study */}
                    <section ref={el => sectionsRef.current[1] = el} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4 order-2 md:order-1">
                            {program.howToStudy.map((item, i) => (
                                <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300">
                                    <div className="flex gap-4">
                                        <div className="mt-1 p-1 rounded bg-blue-500/20 text-blue-500">
                                            <Lightbulb className="w-4 h-4" />
                                        </div>
                                        <p className="text-gray-300 font-medium">{item}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-1 space-y-6 order-1 md:order-2 text-right md:text-left">
                            <div className="p-4 inline-flex rounded-2xl bg-blue-500/10 text-blue-500">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl font-lexend font-bold">How <span className="text-blue-500">to Study</span></h2>
                            <p className="text-gray-400 text-lg">
                                Mastering a new skill requires a strategic approach. Follow these steps to maximize your learning efficiency.
                            </p>
                        </div>
                    </section>

                    {/* What NOT to study */}
                    <section ref={el => sectionsRef.current[2] = el} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="p-4 inline-flex rounded-2xl bg-red-500/10 text-red-500">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl font-lexend font-bold">What <span className="text-red-500">to Avoid</span></h2>
                            <p className="text-gray-400 text-lg">
                                Don&apos;t waste your time on outdated techs or counterproductive habits. Focus on what truly matters in 2024.
                            </p>
                        </div>
                        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                            {program.avoid.map((item, i) => (
                                <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/10 transition-all duration-300">
                                    <div className="flex gap-4">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-red-500 group-hover:scale-150 transition-transform" />
                                        <p className="text-gray-400">{item}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>


                </div>
            </main>

            {/* Footer space */}
            <div className="h-24 bg-gradient-to-t from-pink-500/5 to-transparent" />
        </div>
    );
}
