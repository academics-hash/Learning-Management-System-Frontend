"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const Content = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const cards = containerRef.current.querySelectorAll('.pop-card');

        gsap.fromTo(cards,
            {
                scale: 0,
                opacity: 0,
            },
            {
                scale: 1,
                opacity: (i, target) => {
                    // Preserve original opacity intent (some are 0.8)
                    return target.classList.contains('opacity-80') ? 0.8 : 1;
                },
                duration: 1.2,
                stagger: 0.15,
                ease: "elastic.out(1, 0.5)", // Bouncy pop effect
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%", // Start when container is near viewport
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section className="relative w-full py-20 px-6 overflow-hidden -mt-40">
            <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-10">

                {/* Left Content */}
                <div className="w-full lg:w-[45%] flex flex-col gap-8 z-10">
                    <div className="space-y-4">
                        <span className="block w-[186px] h-[19px]  font-['Exo'] font-semibold text-[16px] leading-[120%] tracking-[0%] capitalize">
                            Get More Power From
                        </span>
                        <h2 className="w-full max-w-[462px] text-white font-['Lexend_Deca'] font-medium text-[32px] md:text-[40px] leading-[140%] tracking-[0%] capitalize">
                            Boost Your Skills With <br className="hidden md:block" /> Add-On Courses
                        </h2>
                        <p className="w-full max-w-[450px] text-gray-300 font-['Jost'] font-normal text-[18px] leading-[150%] tracking-[0%]">
                            Go beyond your main track—explore specialized lessons, career prep modules, and hands-on projects to stand out.
                        </p>
                    </div>

                    <Link
                        href="/courses"
                        className="inline-flex items-center justify-center w-[155.7px] h-[42.13px] bg-[#D75287] hover:bg-[#c44576] text-white font-medium rounded-[80px] transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(215,82,135,0.4)]"
                    >
                        Explore Courses
                    </Link>
                </div>

                {/* Right Content - Scattered Images */}
                <div className="w-full lg:w-[55%] relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center [perspective:1000px] mt-30">
                    {/* Container for the scattered effect */}
                    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">

                        {/* Back Layer */}
                        {/* Back Layer */}
                        <div className="pop-card absolute top-[10%] left-[10%] w-[260px] md:w-[366.86px] h-[132px] md:h-[186.54px] transform -rotate-12 z-0 opacity-80">
                            <Image src="/image/skill-1.png" alt="Skill 1" fill className="object-cover rounded-[24.45px] shadow-2xl" />
                        </div>
                        <div className="pop-card absolute bottom-[20%] right-[5%] w-[260px] md:w-[366.86px] h-[132px] md:h-[186.54px] transform rotate-6 z-10">
                            <Image src="/image/skill-2.png" alt="Skill 2" fill className="object-cover rounded-[24.45px] shadow-2xl" />
                        </div>

                        {/* Middle Layer */}
                        <div className="pop-card absolute top-[5%] right-[15%] w-[260px] md:w-[366.86px] h-[132px] md:h-[186.54px] transform rotate-12 z-10">
                            <Image src="/image/skill-3.png" alt="Skill 3" fill className="object-cover rounded-[24.45px] shadow-2xl" />
                        </div>
                        <div className="pop-card absolute bottom-[10%] left-[20%] w-[260px] md:w-[366.86px] h-[132px] md:h-[186.54px] transform -rotate-6 z-10">
                            <Image src="/image/skill-4.png" alt="Skill 4" fill className="object-cover rounded-[24.45px] shadow-2xl" />
                        </div>

                        {/* Front Layer - Main Focus */}
                        <div className="pop-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] md:w-[366.86px] h-[132px] md:h-[186.54px] transform z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                            <Image src="/image/skill-5.png" alt="Skill Main" fill className="object-cover rounded-[24.45px] shadow-2xl" />
                        </div>

                        {/* Floating Small Element */}
                        <div className="pop-card absolute top-[20%] left-[40%] w-[260px] md:w-[366.86px] h-[132px] md:h-[186.54px] transform -rotate-12 translate-y-[-50px] z-20">
                            <Image src="/image/skill-6.png" alt="Skill 6" fill className="object-cover rounded-[24.45px] shadow-2xl" />
                        </div>

                    </div>
                </div>

            </div>

            {/* Background Glow Effect */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#D75287] rounded-full blur-[120px] opacity-10 -z-10 pointer-events-none"></div>
        </section>
    )
}

export default Content