"use client";
import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetCourseContentQuery } from "@/feature/api/courseApi"; // or useGetCourseByIdQuery
import { FaClock, FaPlayCircle, FaLock, FaUserGraduate } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const CourseDetail = ({ params }) => {
    // params is a Promise in Next.js 15+, need to unwrap it with React.use()
    const resolvedParams = use(params);
    const courseId = resolvedParams.courseId;

    const { data, isLoading, error } = useGetCourseContentQuery(courseId);
    const { user } = useSelector((state) => state.auth);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <h2 className="text-xl font-bold text-red-500">Failed to load course</h2>
                <p className="text-gray-600">Please try again later.</p>
                <Link href="/" className="text-blue-600 hover:underline">Go back home</Link>
            </div>
        );
    }

    const { course, accessType } = data;
    const isEnrolled = accessType === "enrolled" || accessType === "free";

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                        {/* Left: Text Info */}
                        <div className="space-y-6">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                                {course.category}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                                {course.course_title}
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {course.sub_title || course.description?.substring(0, 150) + "..."}
                            </p>

                            <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                        <Image
                                            src="/image/logo.png"
                                            alt="Instructor"
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </div>
                                    <span>Created by <span className="text-gray-900">Stackup</span></span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaClock className="text-gray-400" />
                                    <span>Last updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                {isEnrolled ? (
                                    <Link
                                        href={`/course/${courseId}/lecture/${course.lectures?.[0]?.id || 'none'}`}
                                        className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
                                    >
                                        Please Watch Lecture
                                    </Link>
                                ) : (
                                    <button className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">
                                        Enroll Now for {course.course_price > 0 ? `₹${course.course_price}` : "Free"}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right: Thumbnail */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                            <Image
                                src={course.course_thumbnail || "/image/placeholder.png"}
                                alt={course.course_title}
                                fill
                                className="object-cover"
                            />
                            {!isEnrolled && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <FaPlayCircle className="w-16 h-16 text-white opacity-80" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content: Description & Curriculum */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Description */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h3>
                            <div className="prose prose-blue max-w-none text-gray-600">
                                <p>{course.description}</p>
                            </div>
                        </div>

                        {/* Curriculum / Lectures */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h3>
                            <div className="space-y-4">
                                {course.lectures?.length > 0 ? (
                                    Object.entries(
                                        course.lectures.reduce((acc, lecture) => {
                                            const section = lecture.section || "General";
                                            if (!acc[section]) acc[section] = [];
                                            acc[section].push(lecture);
                                            return acc;
                                        }, {})
                                    ).map(([section, sectionLectures], sectionIndex) => (
                                        <div key={section} className="mb-6 last:mb-0">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                                                {section}
                                            </h4>
                                            <div className="space-y-3">
                                                {sectionLectures.map((lecture, index) => {
                                                    // Calculate global index if needed, or just use index within section
                                                    // For continuous numbering, we might need a different approach, 
                                                    // but 1-based index per section is also fine. 
                                                    // Let's stick to per-section for now or just remove numbering.
                                                    // Actually, continuous numbering is better.

                                                    // Find index in original array
                                                    const originalIndex = course.lectures.findIndex(l => l.id === lecture.id);

                                                    return (
                                                        <Link
                                                            key={lecture.id}
                                                            href={(isEnrolled || lecture.isPreviewFree) ? `/course/${courseId}/lecture/${lecture.id}` : '#'}
                                                            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${isEnrolled || lecture.isPreviewFree
                                                                ? "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                                                : "bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed"
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isEnrolled || lecture.isPreviewFree ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"
                                                                    }`}>
                                                                    {originalIndex + 1}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className={`font-medium ${isEnrolled || lecture.isPreviewFree ? "text-gray-900" : "text-gray-500"}`}>
                                                                        {lecture.lectureTitle}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                                        <FaPlayCircle className="w-3" /> Video
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {isEnrolled || lecture.isPreviewFree ? (
                                                                    <FaPlayCircle className="text-blue-600 w-5 h-5" />
                                                                ) : (
                                                                    <FaLock className="text-gray-400 w-4 h-4" />
                                                                )}
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No lectures available for this course yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area (Optional: Instructor Info, etc) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
                            <h4 className="font-bold text-gray-900 mb-4">Includes</h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-center gap-3">
                                    <FaUserGraduate className="text-blue-500" />
                                    <span>Lifetime access</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <FaPlayCircle className="text-blue-500" />
                                    <span>Access on mobile and TV</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <FaLock className="text-blue-500" />
                                    <span>Certificate of completion</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
