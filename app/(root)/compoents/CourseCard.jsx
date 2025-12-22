"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, CheckCircle2 } from "lucide-react";

const CourseCard = ({ course, showProgress = false, progress = 0 }) => {
    return (
        <Link href={`/course/${course._id || course.id}`} className="block group">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-[#DC5178]/10 transition-all duration-500 hover:-translate-y-1">
                {/* Thumbnail */}
                <div className="relative w-full aspect-video bg-[#1a1a2e] overflow-hidden rounded-t-2xl">
                    <Image
                        src={course.course_thumbnail || "/image/placeholder.png"}
                        alt={course.course_title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                        <span className="text-white text-xs font-medium backdrop-blur-md bg-white/20 px-3 py-1.5 rounded-full">
                            {showProgress ? "Continue Learning" : "View Course Details"}
                        </span>
                    </div>
                    {/* Progress Badge */}
                    {showProgress && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                            <CheckCircle2 size={14} className="text-[#DC5178]" />
                            <span className="text-xs font-bold text-gray-900">{progress}%</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Category Badge */}
                    <span className="inline-block bg-[#DC5178]/10 text-[#DC5178] text-[11px] font-bold px-3 py-1 rounded-md mb-3 uppercase tracking-wider">
                        {course.category || 'Development'}
                    </span>

                    {/* Title */}
                    <h3 className="text-[16px] font-bold leading-snug text-[#1a1a1a] mb-4 line-clamp-2 min-h-[44px] group-hover:text-[#DC5178] transition-colors">
                        {course.course_title || "Beginner's Guide to becoming a JavaScript Developer"}
                    </h3>

                    {/* Author */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                            <Image
                                src="/image/logo.png"
                                alt="Author"
                                fill
                                className="object-cover p-0.5"
                            />
                        </div>
                        <span className="text-[13px] text-gray-500">
                            By <span className="text-gray-900 font-medium">Stackup</span>
                        </span>
                    </div>

                    {/* Progress Bar - Only shows when showProgress is true */}
                    {showProgress && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="text-gray-500 font-medium">Progress</span>
                                <span className="text-[#DC5178] font-bold">{progress}% Complete</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-linear-to-r from-[#DC5178] to-[#ff7ba3] rounded-full transition-all duration-500"

                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-[#DC5178]" />
                            <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">
                                {course.createdAt ? new Date(course.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                            </span>
                        </div>
                    </div>


                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            {course.course_type === 'free' ? (
                                <>
                                    <span className="text-gray-400 line-through text-[12px]">₹2,499</span>
                                    <span className="text-[#DC5178] font-bold text-[16px]">Free</span>
                                </>
                            ) : (
                                <span className="text-[#DC5178] font-bold text-[16px]">
                                    ₹{course.course_price}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-[#1a1a1a] font-bold text-[13px] group-hover:translate-x-1 transition-transform">
                            <span>{showProgress ? "Continue" : "Enroll"}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14m-7-7 7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;

