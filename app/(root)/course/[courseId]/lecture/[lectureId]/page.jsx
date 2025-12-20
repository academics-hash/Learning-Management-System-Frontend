"use client";
import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetCourseContentQuery } from "@/feature/api/courseApi";
import { FaPlayCircle, FaCheckCircle, FaLock, FaChevronLeft, FaBars } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const LecturePlayer = ({ params }) => {
    const resolvedParams = use(params);
    const { courseId, lectureId } = resolvedParams;
    const router = useRouter();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Fetch full course content (including lectures with videoUrls if allowed)
    const { data, isLoading, error } = useGetCourseContentQuery(courseId);

    // Find current lecture
    const currentLecture = data?.course?.lectures?.find(l => l.id.toString() === lectureId);

    // Find next lecture for auto-play or button
    const currentLectureIndex = data?.course?.lectures?.findIndex(l => l.id.toString() === lectureId);
    const nextLecture = data?.course?.lectures?.[currentLectureIndex + 1];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
        );
    }

    if (error || !currentLecture) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-4">
                <h2 className="text-xl font-bold text-red-400">Content Unavailable</h2>
                <p className="text-gray-400">This lecture is either locked or does not exist.</p>
                <Link href={`/course/${courseId}`} className="text-blue-400 hover:underline">
                    Back to Course
                </Link>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">

            {/* Main Content Area (Player) */}
            <div className="flex-1 flex flex-col relative min-w-0">

                {/* Top Navigation */}
                <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 z-20">
                    <div className="flex items-center gap-4">
                        <Link href={`/course/${courseId}`} className="p-2 hover:bg-gray-700 rounded-full transition">
                            <FaChevronLeft />
                        </Link>
                        <div>
                            <h1 className="text-sm md:text-base font-medium line-clamp-1">{data.course.course_title}</h1>
                            <p className="text-xs text-gray-400 line-clamp-1">{currentLecture.lectureTitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-700 rounded-md md:hidden"
                    >
                        <FaBars />
                    </button>
                    <div className="hidden md:block w-8"></div> {/* Spacer */}
                </div>

                {/* Video Player Container */}
                <div className="flex-1 flex items-center justify-center bg-black relative overflow-y-auto">
                    <div className="w-full max-w-5xl aspect-video bg-black shadow-2xl relative">
                        {currentLecture.videoUrl ? (
                            <video
                                src={currentLecture.videoUrl}
                                controls
                                controlsList="nodownload"
                                className="w-full h-full object-contain"
                                autoPlay
                                poster={data.course.course_thumbnail}
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                <div className="text-center p-6">
                                    <FaLock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">Content Locked</h3>
                                    <p className="text-gray-400 mb-6">You need to enroll in this course to view this lecture.</p>
                                    <Link href={`/course/${courseId}`} className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                                        Enroll Now
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer / Navigation Controls */}
                <div className="h-16 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-6">
                    <span className="text-sm text-gray-400">
                        Lecture {currentLectureIndex + 1} of {data.course.lectures.length}
                    </span>
                    {nextLecture && (
                        <Link
                            href={`/course/${courseId}/lecture/${nextLecture.id}`}
                            className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition flex items-center gap-2"
                        >
                            Next Lecture <FaPlayCircle />
                        </Link>
                    )}
                </div>
            </div>

            {/* Sidebar (Curriculum) */}
            <div className={`
                fixed inset-y-0 right-0 w-80 bg-gray-800 border-l border-gray-700 transform transition-transform duration-300 ease-in-out z-30
                md:relative md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="p-5 border-b border-gray-700 flex items-center justify-between">
                        <h2 className="font-bold text-lg">Course Content</h2>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="md:hidden p-1 hover:bg-gray-700 rounded"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {(() => {
                            const grouped = data.course.lectures.reduce((acc, lecture) => {
                                const section = lecture.section || "General";
                                if (!acc[section]) acc[section] = [];
                                acc[section].push(lecture);
                                return acc;
                            }, {});

                            return Object.entries(grouped).map(([section, sectionLectures]) => (
                                <div key={section} className="mb-4 last:mb-0">
                                    <div className="px-3 py-2 bg-gray-700/50 text-xs font-bold text-gray-400 uppercase tracking-wider sticky top-0 backdrop-blur-md">
                                        {section}
                                    </div>
                                    <div className="space-y-1 mt-1">
                                        {sectionLectures.map((lecture) => {
                                            const index = data.course.lectures.findIndex(l => l.id === lecture.id);
                                            const isActive = lecture.id.toString() === lectureId;
                                            const isLocked = !lecture.videoUrl && !lecture.isPreviewFree;

                                            return (
                                                <Link
                                                    key={lecture.id}
                                                    href={!isLocked ? `/course/${courseId}/lecture/${lecture.id}` : '#'}
                                                    className={`
                                                        flex items-start gap-3 p-3 mx-2 rounded-lg transition-colors
                                                        ${isActive ? 'bg-blue-600/20 border border-blue-600/50' : 'hover:bg-gray-700 border border-transparent'}
                                                        ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                                    `}
                                                >
                                                    <div className="mt-1">
                                                        {isActive ? (
                                                            <FaPlayCircle className="text-blue-400 w-4 h-4" />
                                                        ) : isLocked ? (
                                                            <FaLock className="text-gray-500 w-4 h-4" />
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full border-2 border-gray-500 flex items-center justify-center">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`text-sm font-medium ${isActive ? 'text-blue-400' : 'text-gray-200'}`}>
                                                            {index + 1}. {lecture.lectureTitle}
                                                        </h4>
                                                        <span className="text-xs text-gray-500 mt-1 block">Video</span>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default LecturePlayer;
