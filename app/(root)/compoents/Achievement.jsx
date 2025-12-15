'use client'
import React from 'react'
import Image from 'next/image'

const Achievement = () => {
    const stats = [
        { number: '3500+', label: 'Students Trained' },
        { number: '120+', label: 'Industry-Relevant Projects' },
        { number: '85%', label: 'Course Completion Rate' },
        { number: '200+', label: 'Graduates Hired in Tech Roles' },
    ]

    return (
        <section className="w-full  md:py-24  bg-[#FFFFFF] rounded-[30px] mt-5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Column: Content & Stats */}
                    <div className="w-full lg:w-1/2 space-y-12">
                        <div className="space-y-4 text-center lg:text-left">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] font-switzer">
                                We Help You Build <span className="text-[#e91e63]">Real Tech Skills</span>
                            </h2>
                            <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto lg:mx-0 font-switzer">
                                Structured courses, hands-on projects, and mentorship designed to help beginners become job-ready developers.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 md:gap-12">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex flex-col space-y-2 border-l-[3px] border-[#e91e63] pl-6">
                                    <span className="text-3xl md:text-4xl font-bold text-[#1a1a1a] font-switzer">
                                        {stat.number}
                                    </span>
                                    <span className="text-sm md:text-base text-gray-600 font-medium font-switzer">
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