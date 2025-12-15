'use client'
import React from 'react'
import Image from 'next/image'
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const Achievement = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 1,
    });

    const stats = [
        { number: 3500, suffix: '+', label: 'Students Trained' },
        { number: 120, suffix: '+', label: 'Industry-Relevant Projects' },
        { number: 85, suffix: '%', label: 'Course Completion Rate' },
        { number: 200, suffix: '+', label: 'Graduates Hired in Tech Roles' },
    ]

    return (
        <section className="w-full md:py-24 bg-[#FFFFFF] rounded-[30px] mt-10 px-6 py-16">
            <div className="max-w-7xl mx-auto">
                {/* Top Section: Heading & Subtitle */}
                <div className="text-center mb-16 space-y-4">
                    <div className="flex flex-col items-center gap-3">
                        <h2 className="text-[40px] leading-[136%] tracking-[-0.04em] capitalize font-medium text-[#1a1a1a] font-lexend">
                            We Help You Build <span className="font-light text-[#1a1a1a]">Real Tech Skills</span>
                        </h2>
                        <div className="w-[341px] max-w-full h-[3px] bg-[#D75287] "></div>
                    </div>
                    <p className="text-gray-600 text-[18px] font-medium leading-[150%] tracking-[0%] text-center max-w-[668px] mx-auto font-inter">
                        Structured courses, hands-on projects, and mentorship designed to help beginners become job-ready developers.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Column: Stats */}
                    <div className="w-full lg:w-1/2">
                        <div ref={ref} className="grid grid-cols-2 gap-x-8 gap-y-12">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex flex-col space-y-2 border-l-[3px] border-[#e91e63] pl-6 h-full justify-center">
                                    <span className="text-[48px] font-light text-[#1a1a1a] font-lexend leading-[120%] tracking-[0%] capitalize">
                                        {inView ? <CountUp start={0} end={stat.number} duration={2.5} separator="" /> : 0}
                                        {stat.suffix}
                                    </span>
                                    <span className="text-[18px] text-black font-normal font-jost leading-[150%] tracking-[0%] w-[102px] max-w-full">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Image */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[600px] aspect-4/3">
                            <Image
                                src="/image/girl.png"
                                alt="Student Success"
                                fill
                                className="object-cover rounded-[60px]"
                                priority
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Achievement