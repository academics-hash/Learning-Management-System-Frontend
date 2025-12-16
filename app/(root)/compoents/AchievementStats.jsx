'use client'
import React from 'react'
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const AchievementStats = () => {
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
    )
}

export default AchievementStats
