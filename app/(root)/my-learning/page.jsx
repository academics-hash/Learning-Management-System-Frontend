"use client";
import React from "react";
import { useGetMyEnrolledCoursesQuery } from "@/feature/api/enrollmentApi";
import CourseCard from "../compoents/CourseCard";
import Image from "next/image";
import { Loader2, GraduationCap, BookOpen, Clock, CheckCircle2, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const MyLearningPage = () => {
    const { data, isLoading, error } = useGetMyEnrolledCoursesQuery();

    useGSAP(() => {
        if (!isLoading && data?.courses?.length > 0) {
            gsap.from(".course-card-anim", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out"
            });
            gsap.from(".page-header", {
                y: -20,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out"
            });
        }
    }, [isLoading, data]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-pink-100 rounded-full animate-pulse"></div>
                    <Loader2 className="w-8 h-8 animate-spin text-[#DC5178] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-4 text-gray-500 font-jost font-medium">Loading your journey...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="bg-red-50 p-8 rounded-[2rem] text-center max-w-md border border-red-100">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <X className="text-red-500 w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 font-lexend mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-500 font-jost mb-6">We couldn&apos;t load your enrolled courses. Please try again later.</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#DC5178] text-white rounded-xl font-lexend font-medium">Retry</button>
                </div>
            </div>
        );
    }

    const courses = data?.courses || [];

    return (
        <div className="min-h-screen bg-white mt-8 rounded-[24px] pt-16 pb-20 px-4 md:px-8 border border-gray-100 shadow-sm">

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="page-header mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <GraduationCap className="text-[#DC5178] w-6 h-6" />
                            <span className="text-sm font-bold text-[#DC5178] uppercase tracking-widest font-lexend">Your Education</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-lexend tracking-tight">
                            My Learning <span className="text-[#DC5178]">Journey</span>
                        </h1>
                        <p className="text-gray-500 font-jost text-lg mt-3 max-w-xl">
                            Track your progress, continue where you left off, and achieve your learning goals.
                        </p>
                    </div>
                    <Link
                        href="/courses"
                        className="flex items-center gap-2 group text-gray-900 font-bold font-lexend"
                    >
                        Browse More Courses
                        <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#DC5178] group-hover:text-white transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </Link>
                </div>

                {courses.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-16 text-center border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="text-[#DC5178] w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 font-lexend mb-3">No active enrollments</h2>
                        <p className="text-gray-500 font-jost text-lg mb-8 max-w-md mx-auto">
                            You haven&apos;t enrolled in any courses yet. Start your learning journey today!
                        </p>
                        <Link
                            href="/courses"
                            className="inline-flex items-center justify-center px-10 py-4 bg-[#DC5178] text-white rounded-2xl font-bold font-lexend shadow-xl shadow-pink-200 hover:scale-105 transition-transform"
                        >
                            Explore Courses
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Summary Table Section */}
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="font-bold text-xl text-gray-900 font-lexend">Course Progress Summary</h3>
                                <span className="bg-[#DC5178]/10 text-[#DC5178] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                                    {courses.length} ACTIVE COURSES
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-jost">
                                    <thead className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                        <tr>
                                            <th className="px-8 py-4">Course Name</th>
                                            <th className="px-8 py-4">Enrollment Date</th>
                                            <th className="px-8 py-4">Status</th>
                                            <th className="px-8 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {courses.map((course) => (
                                            <tr key={course.id} className="hover:bg-gray-50/80 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm bg-gray-100">
                                                            <Image
                                                                src={course.course_thumbnail || '/image/logo.png'}
                                                                alt={course.course_title || 'Course Thumbnail'}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <span className="font-bold text-gray-900 font-lexend line-clamp-1">{course.course_title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-sm font-medium text-gray-600">
                                                        {new Date(course.enrollmentDate).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 size={16} className="text-green-500" />
                                                        <span className="text-sm font-bold text-green-600">
                                                            Active
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <Link
                                                        href={`/course/${course.id}`}
                                                        className="inline-flex items-center gap-2 text-sm font-bold text-[#DC5178] hover:gap-3 transition-all"
                                                    >
                                                        Continue
                                                        <ChevronRight size={16} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Visual Card Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {courses.map((course) => (
                                <div key={course.id} className="course-card-anim">
                                    <CourseCard course={course} showProgress={true} progress={course.progress || 0} />
                                </div>
                            ))}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLearningPage;
