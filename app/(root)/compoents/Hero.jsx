"use client";
import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaLaptopCode, FaBookOpen } from 'react-icons/fa'
import { LuHeartHandshake } from "react-icons/lu";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const Hero = () => {
    const contentRef = useRef(null);
    const cubeRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from(contentRef.current.children, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            delay: 0.2,
            onComplete: () => {
                if (cubeRef.current) {
                    const loopTl = gsap.timeline({ repeat: -1 });
                    loopTl.to(cubeRef.current, { rotationX: -90, duration: 1.5, ease: "elastic.out(1, 0.75)", delay: 2 })
                        .to(cubeRef.current, { rotationX: -180, duration: 1.5, ease: "elastic.out(1, 0.75)", delay: 2 })
                        .to(cubeRef.current, { rotationX: -270, duration: 1.5, ease: "elastic.out(1, 0.75)", delay: 2 })
                        .to(cubeRef.current, { rotationX: -360, duration: 1.5, ease: "elastic.out(1, 0.75)", delay: 2 })
                        .set(cubeRef.current, { rotationX: 0 });
                }
            }
        });
    }, { scope: contentRef });

    return (
        <section className="relative w-full pt-16 pb-32 px-6 z-20">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                {/* Left Content */}
                <div ref={contentRef} className="w-full lg:w-1/2 space-y-8 mt-32 opacity-100">
                    <h6 className="text-[40.72px] font-medium leading-[120%] tracking-[-0.02em] text-white capitalize font-montserrat max-w-[638px]">
                        Elevate Your Skills Online With Our{' '}
                        <span className="inline-grid h-[1.2em] grid-cols-1 grid-rows-1 align-bottom [perspective:300px] ml-4">
                            {/* Spacer to hold width of longest text */}
                            <span className="col-start-1 text-[40.72px] row-start-1 opacity-0 pointer-events-none whitespace-pre font-medium">
                                Expert Guidance
                            </span>

                            {/* Rotating Cube */}
                            <span
                                ref={cubeRef}
                                className="col-start-1 row-start-1 relative [transform-style:preserve-3d]"
                            >
                                {/* Face 1: Free Course (Front) */}
                                <span className=" text-[40.72px] absolute inset-0 flex items-center justify-start [backface-visibility:hidden] [transform:translateZ(0.6em)] gap-2">
                                    Free Course
                                </span>
                                {/* Face 2: Expert Guidance (Top) */}
                                <span className="text-[40.72px] absolute inset-0 flex items-center justify-start text-[#D75287] [backface-visibility:hidden] [transform:rotateX(90deg)_translateZ(0.6em)]">
                                    Expert Guidance
                                </span>
                                {/* Face 3: Free Course (Back) */}
                                <span className="text-[40.72px] absolute inset-0 flex items-center justify-start [backface-visibility:hidden] [transform:rotateX(180deg)_translateZ(0.6em)]">
                                    Free Course
                                </span>
                                {/* Face 4: Expert Guidance (Bottom) */}
                                <span className="text-[40.72px] absolute inset-0 flex items-center justify-start text-[#D75287] [backface-visibility:hidden] [transform:rotateX(270deg)_translateZ(0.6em)]">
                                    Expert Guidance
                                </span>
                            </span>
                        </span>
                    </h6>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-[#2E0215]/80 border border-white/10 rounded-full px-5 py-2.5 backdrop-blur-sm transition-transform hover:scale-105">
                            <LuHeartHandshake className="text-white/80" />
                            <span className="text-white font-medium text-[10.53px] leading-[100%] tracking-[0%] font-montserrat">Personal Support</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#2E0215]/80 border border-white/10 rounded-full px-5 py-2.5 backdrop-blur-sm transition-transform hover:scale-105">
                            <FaLaptopCode className="text-white/80" />
                            <span className="text-white font-medium text-[10.53px] leading-[100%] tracking-[0%] font-montserrat">Project-Based Learning</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#2E0215]/80 border border-white/10 rounded-full px-5 py-2.5 backdrop-blur-sm transition-transform hover:scale-105">
                            <FaBookOpen className="text-white/80" />
                            <span className="text-white font-medium text-[10.53px] leading-[100%] tracking-[0%] font-montserrat">Learn by Doing</span>
                        </div>
                    </div>

                    <p className="text-[17px] font-normal font-inter leading-[150%] tracking-[0%] text-white max-w-[603px]">
                        We denounce with righteous indignation and dislike men who are so beguiled and demoralized that cannot trouble.
                    </p>

                    <div>
                        {/* Wrapped Link in div because functional components like Link sometimes have issues with direct ref attachment or animation if they don't forward refs properly, though GSAP usually handles it via DOM selection. However, Link IS a component, so wrapping it ensures the div is what's animated. Actually, contentRef.current.children will pick up the Link's output anchor tag if it renders one, or the Link component itself. Next.js Link renders an anchor tag by default in newer versions. But to be safe and consistent with "children" selector, wrapping in a div or just letting it be is fine. 
                         Wait, Link in Next.js 13+ (which this likely is given "app" dir) renders an <a> tag. 
                         But wait, I am animating `contentRef.current.children`. 
                         The children are `h6`, `div`, `p`, `Link`.
                         If `Link` is a React component, `contentRef.current.children` gets the DOM nodes. 
                         Next.js Link renders an `<a>`. So it should be fine. 
                         However, `Link` component might not hold the style/className perfectly if animated externally sometimes? No, `from` animates the DOM element. The `Link` produces an `<a>` tag in the DOM. So `children[3]` will be that `<a>`. It should work.
                         */}
                        <Link
                            href="/courses"
                            className="flex items-center justify-center w-[129px] h-[44px] bg-[#D75287] hover:bg-[#c74772] text-white gap-[6px] rounded-[80px] px-[20px] py-[16px] transition-all shadow-[0_0_20px_rgba(215,82,135,0.4)] hover:shadow-[0_0_30px_rgba(215,82,135,0.6)] text-[16px] font-medium font-inter leading-[100%] tracking-[0%]"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>

                {/* Right Images - Grid with DEEP Overlap */}
                <div className="w-full lg:w-1/2 relative">
                    {/* 
                        INCREASED negative margin to create deep overlap into next section
                        -mb-48 = 192px, -mb-64 = 256px, -mb-80 = 320px
                    */}
                    <div className="grid grid-cols-2 gap-4 -mb-60 md:-mb-72 lg:-mb-80 ">

                        {/* Left Column: 2 images stacked */}
                        <div className="flex flex-col gap-4 pt-8 -mt-12">
                            <div className="relative h-[250px] md:h-[320px] w-full" data-effect="cinematic-reveal">
                                <Image
                                    src="/image/hero-1.png"
                                    alt="Group Learning"
                                    fill
                                    className="object-cover rounded-3xl hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                            <div className="relative h-[250px] md:h-[320px] w-full" data-effect="cinematic-reveal">
                                <Image
                                    src="/image/hero-2.png"
                                    alt="Student Focus"
                                    fill
                                    className="object-cover rounded-3xl hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                        </div>

                        {/* Right Column: Starts higher, with gap between images */}
                        <div className="flex flex-col gap-4 -mt-20">
                            <div className="relative h-[250px] md:h-[320px] w-full" data-effect="cinematic-reveal">
                                <Image
                                    src="/image/hero-2.png"
                                    alt="Coding Success"
                                    fill
                                    className="object-cover rounded-3xl hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                            {/* Extra gap to push last image down more */}
                            <div className="relative h-[250px] md:h-[320px] w-full mt-1" data-effect="cinematic-reveal">
                                <Image
                                    src="/image/hero-3.png"
                                    alt="Collaboration"
                                    fill
                                    className="object-cover rounded-3xl hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    )
}

export default Hero