"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaClock, FaUserGraduate, FaRegHeart, FaHeart } from "react-icons/fa";

const CourseCard = ({ course }) => {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div className="group flex flex-col bg-[#F9F9F9] rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 p-4 border border-transparent hover:border-gray-200/50">

            {/* Image Container */}
            <div className="relative w-full aspect-4/3 rounded-[20px] overflow-hidden mb-4 bg-gray-100">
                <Image
                    src={course.course_thumbnail || "/image/placeholder.png"}
                    alt={course.course_title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLiked(!isLiked);
                    }}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-[#DC5178] transition-all duration-300"
                >
                    {isLiked ? <FaHeart className="text-[#DC5178]" /> : <FaRegHeart />}
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col grow gap-3">

                {/* Badge */}
                <div className="flex items-start">
                    <span className="bg-[#D752871C] text-[#DC5178] text-[12px] font-semibold px-[16.36px] py-[4px] rounded-[10.9px] font-jost tracking-wide">
                        {course.category}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-[18.34px] font-medium leading-[23.17px] tracking-[-0.02em] text-[#1A0B10] font-montserrat line-clamp-2 w-full">
                    {course.course_title}
                </h3>

                {/* Progress Bar Decoration */}
                <div className="w-full h-[3px] bg-gray-200 rounded-full mt-1 mb-2 overflow-hidden">
                    <div className="h-full bg-[#DC5178] w-[40%] rounded-full relative">
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]" />
                    </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-white">
                        <Image
                            src="/image/logo.png"
                            alt="Stackup"
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <span className="text-[13.63px] leading-[100%] tracking-[-0.02em] font-medium font-montserrat text-gray-600 capitalize">
                        By Stackup
                    </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                        <FaClock className="text-[#DC5178]" />
                        <span className="text-[13.63px] font-medium font-montserrat leading-[100%] tracking-[0%] capitalize text-[#20202099] w-[54px] h-[17px] flex items-center">
                            22h 30m
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <FaUserGraduate className="text-[#DC5178]" />
                        <span className="text-[13.63px] font-medium font-montserrat leading-[100%] tracking-[0%] capitalize text-[#20202099] h-[17px] flex items-center">
                            {course.enrolledStudents?.length || 0} Students
                        </span>
                    </div>
                </div>

                {/* Footer: Price & Action */}
                <div className="flex items-end justify-between mt-auto pt-2">
                    <div className="flex items-center gap-3">
                        {/* We can show a fake 'original' price if we want, or just the main price */}
                        {course.course_type === 'paid' ? (
                            <span className="text-[#2ECC71] font-medium font-montserrat text-[16.82px] leading-[150%] tracking-[0%] capitalize flex items-center">
                                ₹{course.course_price}
                            </span>
                        ) : (
                            <span className="text-[#2ECC71] font-medium font-montserrat text-[16.82px] leading-[150%] tracking-[0%] capitalize flex items-center">
                                Free
                            </span>
                        )}
                    </div>
                    <Link
                        href={`/course/${course.id}`}
                        className="flex items-center justify-end text-[#1A0B10] font-medium font-montserrat text-[16.82px] leading-[150%] tracking-[-0.02em] capitalize hover:text-[#DC5178] transition-colors duration-300"
                    >
                        View More
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
