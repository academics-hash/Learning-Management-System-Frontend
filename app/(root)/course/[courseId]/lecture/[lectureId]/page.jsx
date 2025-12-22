"use client";
import React, { use, useState } from "react";
import Link from "next/link";
import { useGetCourseContentQuery } from "@/feature/api/courseApi";
import {
    FaPlayCircle,
    FaLock,
    FaChevronLeft,
    FaBars,
    FaChevronDown,
    FaChevronUp,
    FaCheckCircle
} from "react-icons/fa";

import {
    Loader2,
    Play,
    ChevronRight,
    BookOpen,
    Clock,
    Video,
    X,
    CheckCircle,
    Trophy,
    PartyPopper
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import confetti from "canvas-confetti";




import { useRouter } from "next/navigation";
import {
    useGetCourseProgressQuery,
    useUpdateLectureProgressMutation
} from "@/feature/api/courseprogressApi";


const LecturePlayer = ({ params }) => {
    const resolvedParams = use(params);
    const { courseId, lectureId } = resolvedParams;
    const router = useRouter();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedSections, setExpandedSections] = useState({});
    const [showCongratulations, setShowCongratulations] = useState(false);


    // Fetch full course content (including lectures with videoUrls if allowed)
    const { data, isLoading, error } = useGetCourseContentQuery(courseId);

    // Fetch course progress
    const {
        data: progressData,
        isLoading: isProgressLoading
    } = useGetCourseProgressQuery(courseId);

    const [updateLectureProgress] = useUpdateLectureProgressMutation();

    // Find current lecture
    const currentLecture = data?.course?.lectures?.find(l => l.id.toString() === lectureId);


    // Find next lecture for auto-play or button
    const currentLectureIndex = data?.course?.lectures?.findIndex(l => l.id.toString() === lectureId);
    const nextLecture = data?.course?.lectures?.[currentLectureIndex + 1];
    const prevLecture = data?.course?.lectures?.[currentLectureIndex - 1];

    // Toggle section expansion
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleLectureEnd = async () => {
        try {
            await updateLectureProgress({ courseId, lectureId }).unwrap();

            // Automatically play next lecture if it exists
            if (nextLecture) {
                router.push(`/course/${courseId}/lecture/${nextLecture.id}`);
            } else {
                // Course completed!
                setShowCongratulations(true);
            }
        } catch (error) {
            console.error("Failed to update lecture progress:", error?.data?.message || error?.message || error);
        }
    };

    useGSAP(() => {
        if (showCongratulations) {
            // Confetti Blast
            const duration = 10 * 1000;
            const animationEnd = Date.now() + duration;

            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    colors: ['#DC5178', '#FFB7C5', '#FFFFFF']
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    colors: ['#DC5178', '#FFB7C5', '#FFFFFF']
                });
            }, 250);

            gsap.from(".congrats-modal", {
                scale: 0.8,
                opacity: 0,
                duration: 0.6,
                ease: "back.out(1.7)"
            });
            gsap.from(".congrats-icon", {
                y: -50,
                opacity: 0,
                duration: 0.8,
                delay: 0.3,
                ease: "bounce.out"
            });
            gsap.from(".congrats-text", {
                y: 20,
                opacity: 0,
                duration: 0.5,
                delay: 0.6,
                stagger: 0.2
            });
        }
    }, { dependencies: [showCongratulations], scope: ".congrats-modal" });





    if (isLoading || isProgressLoading) {

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white ">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-pink-100 rounded-full animate-pulse"></div>
                    <Loader2 className="w-8 h-8 animate-spin text-[#DC5178] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-4 text-gray-500 font-jost font-medium">Loading lecture...</p>
            </div>
        );
    }

    if (error || !currentLecture) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white px-4">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 text-center max-w-md">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaLock className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 font-lexend mb-3">Content Unavailable</h2>
                    <p className="text-gray-500 font-jost mb-8">This lecture is either locked or does not exist.</p>
                    <Link
                        href={`/course/${courseId}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC5178] text-white rounded-xl font-lexend font-medium hover:bg-[#c03e62] transition-all shadow-lg shadow-pink-200"
                    >
                        <FaChevronLeft className="w-3 h-3" />
                        Back to Course
                    </Link>
                </div>
            </div>
        );
    }

    // Group lectures by section
    const groupedLectures = data.course.lectures.reduce((acc, lecture) => {
        const section = lecture.section || "General";
        if (!acc[section]) acc[section] = [];
        acc[section].push(lecture);
        return acc;
    }, {});

    return (
        <div className="flex min-h-[calc(100vh-100px)] mt-8 mb-12 bg-white rounded-[24px] border border-gray-100 shadow-2xl relative overflow-hidden">

            {/* Main Content Area (Player) */}
            <div className="flex-1 flex flex-col relative min-w-0">

                {/* Top Navigation Bar */}
                <header className="h-16 md:h-18 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-4 md:px-6 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/course/${courseId}`}
                            className="p-2.5 bg-gray-50 hover:bg-[#DC5178] hover:text-white rounded-xl transition-all duration-300 group border border-gray-100"
                        >
                            <FaChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                        </Link>
                        <div className="hidden sm:block">
                            <h1 className="text-sm md:text-base font-bold text-gray-900 font-lexend line-clamp-1">
                                {data.course.course_title}
                            </h1>
                            <p className="text-xs text-gray-500 font-jost line-clamp-1 flex items-center gap-1.5 mt-0.5">
                                <Video className="w-3 h-3 text-[#DC5178]" />
                                {currentLecture.lectureTitle}
                            </p>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <span className="text-xs text-gray-500 font-jost font-medium">Lecture</span>
                        <span className="text-sm font-bold text-[#DC5178] font-lexend">
                            {currentLectureIndex + 1} / {data.course.lectures.length}
                        </span>
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2.5 bg-gray-50 hover:bg-[#DC5178] hover:text-white rounded-xl transition-all duration-300 md:hidden border border-gray-100"
                    >
                        <FaBars className="w-4 h-4" />
                    </button>

                    {/* Desktop Toggle */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-pink-50 text-gray-600 hover:text-[#DC5178] rounded-xl transition-all duration-300 border border-gray-100"
                    >
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs font-medium font-lexend">
                            {isSidebarOpen ? "Hide" : "Show"} Content
                        </span>
                    </button>
                </header>

                {/* Video Player Container */}
                <div className="flex-1 flex flex-col items-center justify-start bg-white relative pt-10 pb-8 px-4 md:pt-16 md:pb-12 md:px-8">
                    <div className="w-full max-w-[1400px]">
                        {/* Video Container */}
                        <div className="relative rounded-[20px] overflow-hidden shadow-2xl shadow-black/40 bg-black aspect-video">
                            {currentLecture.videoUrl ? (
                                <video
                                    src={currentLecture.videoUrl}
                                    controls
                                    controlsList="nodownload"
                                    onContextMenu={(e) => e.preventDefault()}
                                    className="w-full h-full object-contain"
                                    autoPlay
                                    onEnded={handleLectureEnd}
                                    poster={data.course.course_thumbnail}
                                >

                                    {currentLecture.subtitles?.en && (
                                        <track
                                            label="English"
                                            kind="subtitles"
                                            srcLang="en"
                                            src={currentLecture.subtitles.en}
                                            default
                                        />
                                    )}
                                    {currentLecture.subtitles?.hi && (
                                        <track
                                            label="Hindi"
                                            kind="subtitles"
                                            srcLang="hi"
                                            src={currentLecture.subtitles.hi}
                                        />
                                    )}
                                    {currentLecture.subtitles?.ml && (
                                        <track
                                            label="Malayalam"
                                            kind="subtitles"
                                            srcLang="ml"
                                            src={currentLecture.subtitles.ml}
                                        />
                                    )}
                                    {currentLecture.subtitles?.ta && (
                                        <track
                                            label="Tamil"
                                            kind="subtitles"
                                            srcLang="ta"
                                            src={currentLecture.subtitles.ta}
                                        />
                                    )}
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                    <div className="text-center p-8">
                                        <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-600">
                                            <FaLock className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white font-lexend mb-3">Content Locked</h3>
                                        <p className="text-gray-400 font-jost mb-8 max-w-sm">
                                            You need to enroll in this course to view this lecture.
                                        </p>
                                        <Link
                                            href={`/course/${courseId}`}
                                            className="inline-flex items-center gap-2 px-8 py-3 bg-[#DC5178] rounded-xl text-white font-lexend font-medium hover:bg-[#c03e62] transition-all shadow-lg shadow-pink-500/30"
                                        >
                                            Enroll Now
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Lecture Info Card */}
                        <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs text-[#DC5178] font-lexend font-semibold uppercase tracking-wider mb-1">
                                        Now Playing
                                    </p>
                                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 font-lexend mt-1">
                                        {currentLecture.lectureTitle}
                                    </h2>
                                    {currentLecture.section && (
                                        <p className="text-sm text-gray-600 font-jost mt-1 flex items-center gap-2">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            {currentLecture.section}
                                        </p>
                                    )}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex items-center gap-3">
                                    {prevLecture && (
                                        <Link
                                            href={`/course/${courseId}/lecture/${prevLecture.id}`}
                                            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-all flex items-center gap-2 border border-gray-200"
                                        >
                                            <FaChevronLeft className="w-3 h-3" />
                                            <span className="hidden sm:inline">Previous</span>
                                        </Link>
                                    )}
                                    {nextLecture && (
                                        <Link
                                            href={`/course/${courseId}/lecture/${nextLecture.id}`}
                                            className="px-5 py-2.5 bg-[#DC5178] hover:bg-[#c03e62] text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-pink-500/30"
                                        >
                                            <span className="hidden sm:inline">Next Lecture</span>
                                            <span className="sm:hidden">Next</span>
                                            <Play className="w-4 h-4 fill-current" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar (Curriculum) */}
            <aside className={`
                fixed inset-y-0 right-0 w-80 lg:w-[400px] bg-white border-l border-gray-100 shadow-2xl transform transition-transform duration-300 ease-in-out z-30
                md:relative md:translate-x-0 md:shadow-none md:sticky md:top-0 md:h-[calc(100vh-100px)]
                ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-white to-pink-50/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-lg text-gray-900 font-lexend">Course Content</h2>
                                <p className="text-xs text-gray-500 font-jost mt-0.5">
                                    {data.course.lectures.length} lectures
                                </p>
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between text-xs mb-2">
                                <span className="text-gray-500 font-jost font-medium">Progress</span>
                                <span className="text-[#DC5178] font-lexend font-bold">
                                    {progressData?.data?.progress
                                        ? Math.round((progressData.data.progress.filter(p => p.viewed).length / data.course.lectures.length) * 100)
                                        : 0}%
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#DC5178] to-pink-400 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${progressData?.data?.progress
                                            ? (progressData.data.progress.filter(p => p.viewed).length / data.course.lectures.length) * 100
                                            : 0}%`
                                    }}
                                />
                            </div>

                        </div>
                    </div>

                    {/* Lecture List */}
                    <div className="flex-1 overflow-y-auto">
                        {Object.entries(groupedLectures).map(([section, sectionLectures]) => {
                            const isExpanded = expandedSections[section] !== false; // Default to expanded

                            return (
                                <div key={section} className="border-b border-gray-50 last:border-b-0">
                                    {/* Section Header */}
                                    <button
                                        onClick={() => toggleSection(section)}
                                        className="w-full px-5 py-4 bg-gray-50/80 hover:bg-gray-100/80 flex items-center justify-between transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-[#DC5178] rounded-full" />
                                            <span className="text-sm font-bold text-gray-700 font-lexend">
                                                {section}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 font-jost">
                                                {sectionLectures.length} videos
                                            </span>
                                            {isExpanded ? (
                                                <FaChevronUp className="w-3 h-3 text-gray-400" />
                                            ) : (
                                                <FaChevronDown className="w-3 h-3 text-gray-400" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Section Lectures */}
                                    {isExpanded && (
                                        <div className="py-2">
                                            {sectionLectures.map((lecture) => {
                                                const index = data.course.lectures.findIndex(l => l.id === lecture.id);
                                                const isActive = lecture.id.toString() === lectureId;
                                                const isLocked = !lecture.videoUrl && !lecture.isPreviewFree;
                                                const isViewed = progressData?.data?.progress?.find(p => p.lectureId === lecture.id)?.viewed;

                                                return (

                                                    <Link
                                                        key={lecture.id}
                                                        href={!isLocked ? `/course/${courseId}/lecture/${lecture.id}` : '#'}
                                                        className={`
                                                            flex items-start gap-3 px-5 py-3 mx-2 rounded-xl transition-all duration-200
                                                            ${isActive
                                                                ? 'bg-gradient-to-r from-pink-50 to-pink-100/50 border border-[#DC5178]/30 shadow-sm'
                                                                : 'hover:bg-gray-50 border border-transparent'
                                                            }
                                                            ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                                        `}
                                                    >
                                                        {/* Lecture Number/Icon */}
                                                        <div className={`
                                                            flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-lexend
                                                            ${isActive
                                                                ? 'bg-[#DC5178] text-white shadow-md shadow-pink-200'
                                                                : isLocked
                                                                    ? 'bg-gray-100 text-gray-400'
                                                                    : 'bg-gray-100 text-gray-600'
                                                            }
                                                        `}>
                                                            {isLocked ? (
                                                                <FaLock className="w-3 h-3" />
                                                            ) : isViewed ? (
                                                                <FaCheckCircle className="w-4 h-4 text-green-500" />
                                                            ) : isActive ? (
                                                                <Play className="w-3 h-3 fill-current" />
                                                            ) : (
                                                                index + 1
                                                            )}
                                                        </div>


                                                        {/* Lecture Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className={`
                                                                text-sm font-medium line-clamp-2 font-jost leading-snug
                                                                ${isActive ? 'text-[#DC5178]' : 'text-gray-700'}
                                                            `}>
                                                                {lecture.lectureTitle}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mt-1.5">
                                                                <Video className="w-3 h-3 text-gray-400" />
                                                                <span className="text-xs text-gray-400 font-jost">Video</span>
                                                                {isActive && (
                                                                    <span className="text-xs text-[#DC5178] bg-pink-50 px-2 py-0.5 rounded-full font-medium font-lexend">
                                                                        Playing
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-5 border-t border-gray-100 bg-linear-to-r from-pink-50/50 to-white">

                        <Link
                            href={`/course/${courseId}`}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 hover:border-[#DC5178] hover:text-[#DC5178] text-gray-700 rounded-xl transition-all font-lexend font-medium text-sm shadow-sm"
                        >
                            <BookOpen className="w-4 h-4" />
                            View Course Details
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Congratulations Overlay */}
            {showCongratulations && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-[#1a1a2e]/60 backdrop-blur-md">
                    <div className="congrats-modal max-w-md w-full bg-white rounded-[2.5rem] p-10 text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-[#DC5178] via-pink-400 to-[#DC5178]"></div>


                        <div className="congrats-icon w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-lg relative">
                            <Trophy className="text-[#DC5178] w-12 h-12" />
                            <div className="absolute -top-2 -right-2">
                                <PartyPopper className="text-[#DC5178] animate-bounce w-8 h-8" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="congrats-text text-3xl font-black text-gray-900 font-lexend leading-tight">
                                Congratulations!
                            </h2>
                            <p className="congrats-text text-gray-600 font-jost text-lg leading-relaxed">
                                You have successfully completed the course <br />
                                <span className="text-[#DC5178] font-bold">&quot;{data.course.course_title}&quot;</span>
                            </p>
                            <p className="congrats-text text-sm text-gray-400 font-medium">
                                You&apos;ve mastered all the lessons and are one step closer to your goals.
                            </p>
                        </div>

                        <div className="congrats-text mt-10 space-y-3">
                            <button
                                onClick={() => router.push(`/course/${courseId}`)}
                                className="w-full py-4 bg-[#DC5178] text-white rounded-2xl font-black shadow-xl shadow-pink-500/30 hover:bg-[#c03e62] transition-all transform hover:scale-[1.02]"
                            >
                                Back to Course Page
                            </button>
                            <button
                                onClick={() => setShowCongratulations(false)}
                                className="w-full py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                            >
                                Keep Exploring
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default LecturePlayer;
