import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaLaptopCode, FaBookOpen } from 'react-icons/fa'
import { LuHeartHandshake } from "react-icons/lu";

const Hero = () => {
    return (
        <section className="relative w-full pt-16 pb-32 px-6 z-20">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                {/* Left Content */}
                <div className="w-full lg:w-1/2 space-y-8 mt-32">
                    <h6 className="text-[40.72px] font-medium leading-[120%] tracking-[-0.02em] text-white capitalize font-montserrat max-w-[638px]">
                        Elevate Your Skills Online With Our Free Course
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

                    <Link
                        href="/course"
                        className="flex items-center justify-center w-[129px] h-[44px] bg-[#D75287] hover:bg-[#c74772] text-white gap-[6px] rounded-[80px] px-[20px] py-[16px] transition-all shadow-[0_0_20px_rgba(215,82,135,0.4)] hover:shadow-[0_0_30px_rgba(215,82,135,0.6)] text-[16px] font-medium font-inter leading-[100%] tracking-[0%]"
                    >
                        Get Started
                    </Link>
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
                            <div className="relative h-[250px] md:h-[320px] w-full">
                                <Image
                                    src="/image/hero-1.png"
                                    alt="Group Learning"
                                    fill
                                    className="object-cover rounded-3xl hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                            <div className="relative h-[250px] md:h-[320px] w-full">
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
                            <div className="relative h-[250px] md:h-[320px] w-full">
                                <Image
                                    src="/image/hero-2.png"
                                    alt="Coding Success"
                                    fill
                                    className="object-cover rounded-3xl hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                            {/* Extra gap to push last image down more */}
                            <div className="relative h-[250px] md:h-[320px] w-full mt-1">
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