"use client";
import React from 'react'
import CourseCard from './CourseCard'
import Link from 'next/link'

const courses = [
    {
        id: 1,
        title: "Beginner's Guide to becoming a JavaScript Developer",
        category: "JavaScript Basics",
        image: "/image/cardimage.png",
        authorName: "Determined-Poitras",
        authorAvatar: "/image/hero-2.png",
        duration: "2Weeks",
        students: "156",
        price: "29.0"
    },
    {
        id: 2,
        title: "Mastering React.js from Scratch",
        category: "React Development",
        image: "/image/cardimage.png",
        authorName: "Determined-Poitras",
        authorAvatar: "/image/hero-1.png",
        duration: "4Weeks",
        students: "230",
        price: "49.0"
    },
    {
        id: 3,
        title: "CSS Grid and Flexbox for Beginners",
        category: "Web Design",
        image: "/image/cardimage.png",
        authorName: "Determined-Poitras",
        authorAvatar: "/image/hero-1.png",
        duration: "1Week",
        students: "98",
        price: "19.0"
    },
    {
        id: 4,
        title: "CSS Grid and Flexbox for Beginners",
        category: "Web Design",
        image: "/image/cardimage.png",
        authorName: "Determined-Poitras",
        authorAvatar: "/image/hero-1.png",
        duration: "1Week",
        students: "98",
        price: "19.0"
    }
]

const CourseSelection = () => {
    return (
        <section className="w-full flex justify-center px-4 md:px-0 mt-24 md:mt-32 lg:mt-8 mb-16">
            <div className="w-full max-w-[1784px] min-h-[500px] h-auto bg-[#FFFFFF] rounded-[40px] relative z-10 p-6 md:p-14 flex flex-col justify-center">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 md:mb-16 gap-6">
                    <div className="max-w-[511px]">
                        <h2 className="text-[28px] md:text-[40px] leading-[136%] font-medium text-[#1A0B10] font-montserrat tracking-[-0.04em] capitalize">
                            Level Up With Free <br className="hidden md:block" />
                            Beginner-Friendly Courses
                        </h2>
                    </div>
                    <div>
                        <Link
                            href="/courses"
                            className="flex items-center justify-center w-[161px] h-[44px] gap-[6px] rounded-[80px] bg-[#D75287] text-white px-[20px] py-[16px] hover:bg-[#c44a7b] transition-all font-medium font-inter text-sm"
                        >
                            View All Courses
                        </Link>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {courses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CourseSelection
