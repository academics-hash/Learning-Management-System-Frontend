"use client";
import React, { use, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetCourseContentQuery } from "@/feature/api/courseApi";
import {
    Clock,
    Users,
    PlayCircle,
    Play,
    Lock,
    ChevronRight,
    Calendar,
    CheckCircle2,
    ArrowLeft,
    Loader2,
    Shield,
    Globe,
    MonitorPlay
} from "lucide-react";
import { useSelector } from "react-redux";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
    useGetCourseProgressQuery
} from "@/feature/api/courseprogressApi";
import { useEnrollInFreeCourseMutation, useCheckCourseAccessQuery, useRequestCourseAccessMutation } from "@/feature/api/enrollmentApi";
import { toast } from "sonner";


const CourseDetail = ({ params }) => {
    const resolvedParams = use(params);
    const courseId = resolvedParams.courseId;
    const container = useRef(null);

    const { data, isLoading, error, refetch } = useGetCourseContentQuery(courseId);
    const { user } = useSelector((state) => state.auth);
    const [enrollInFreeCourse, { isLoading: isEnrolling }] = useEnrollInFreeCourseMutation();
    const [requestCourseAccess, { isLoading: isRequesting }] = useRequestCourseAccessMutation();

    const { data: accessData, isLoading: isAccessLoading } = useCheckCourseAccessQuery(courseId, { skip: !user });


    // Fetch course progress only if user is logged in

    const {
        data: progressData,
        isLoading: isProgressLoading
    } = useGetCourseProgressQuery(courseId, { skip: !user });

    const router = useRouter();
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);


    const handleEnrollNow = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        const isEnrolled = accessData?.status === "active";

        if (isEnrolled) {
            if (data?.course?.lectures?.[0]?.id) {
                router.push(`/course/${courseId}/lecture/${data.course.lectures[0].id}`);
            } else {
                router.push(`/course/${courseId}/lecture/none`);
            }
            return;
        }

        // Handle direct enrollment for free courses
        if (data?.course?.course_type === "free") {
            try {
                const response = await enrollInFreeCourse(courseId).unwrap();
                toast.success("Enrollment successful!");
                refetch(); // Update course content access status
            } catch (err) {
                toast.error(err?.data?.message || "Failed to enroll in free course.");
            }
        } else {
            // PAID COURSE REQUEST LOGIC
            try {
                await requestCourseAccess(courseId).unwrap();
                toast.success("Request sent! Admin will review shortly.");
            } catch (err) {
                toast.error(err?.data?.message || "Failed to request access.");
            }
        }
    };


    useGSAP(() => {
        if (!isLoading && data) {
            const tl = gsap.timeline();
            tl.from(".animate-fade-up", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            })
                .from(".animate-scale", {
                    scale: 0.95,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.5");
        }
    }, [isLoading, data]);

    if (isLoading || isProgressLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#DC5178]/20 border-t-[#DC5178] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image src="/image/logo.png" alt="Logo" width={24} height={24} className="animate-pulse" />
                    </div>
                </div>
                <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading Course Details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                    <Shield className="w-10 h-10 text-red-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Oops! Course Not Found</h2>
                    <p className="text-gray-600 mt-2">We couldn&apost find the course you&aposre looking for or an error occurred.</p>
                </div>
                <Link
                    href="/courses"
                    className="flex items-center gap-2 px-6 py-3 bg-[#DC5178] text-white rounded-xl font-bold hover:bg-[#c4456a] transition-all shadow-lg shadow-[#DC5178]/20"
                >
                    <ArrowLeft size={18} />
                    Browse All Courses
                </Link>
            </div>
        );
    }

    const { course } = data;
    const isEnrolled = accessData?.status === "active";
    const isPending = accessData?.status === "pending";


    return (
        <div ref={container} className="min-h-screen mt-8 rounded-[16px] bg-[#fafafa] selection:bg-[#DC5178]/20 selection:text-[#DC5178] overflow-hidden border border-gray-100 shadow-2xl">
            {/* Nav Back Header */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 rounded-t-[16px]">
                <div className="w-full px-6 h-16 flex items-center justify-between">
                    <Link href="/courses" className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200/60 text-gray-600 font-medium hover:border-[#DC5178]/30 hover:text-[#DC5178] hover:shadow-lg hover:shadow-[#DC5178]/5 hover:-translate-y-0.5 transition-all duration-300">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
                        <span>Back to Courses</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:block text-sm text-gray-400">Share this course:</span>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-[#DC5178]/10 hover:text-[#DC5178] transition-colors"><Globe size={14} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto bg-white rounded-3xl mt-8 overflow-hidden relative border border-gray-100 shadow-sm">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-[#DC5178]/5 to-transparent pointer-events-none"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#DC5178]/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-[1440px] mx-auto px-6 py-12 md:py-24 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        {/* Left: Course Info */}
                        <div className="lg:col-span-7 space-y-8 animate-fade-up">
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-[#DC5178]/10 text-[#DC5178] rounded-full text-xs font-bold uppercase tracking-widest border border-[#DC5178]/20">
                                        {course.category}
                                    </span>
                                    {course.course_type === 'free' && (
                                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-widest border border-green-100">
                                            Free Access
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                                    {course.course_title}
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium max-w-2xl">
                                    {course.sub_title || "Master the skills needed to excel in your career with our industry-leading curriculum and hands-on projects."}
                                </p>
                            </div>

                            {/* Meta Stats */}
                            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                        <Calendar className="text-[#DC5178] w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Last Updated</p>
                                        <p className="text-sm font-bold text-gray-900">{new Date(course.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                        <Globe className="text-[#DC5178] w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Language</p>
                                        <p className="text-sm font-bold text-gray-900">Malayalam</p>

                                    </div>
                                </div>
                                {isEnrolled && progressData?.data && (
                                    <div className="flex-1 min-w-[200px]">
                                        <div className="flex items-center justify-between text-xs mb-2">
                                            <span className="text-gray-400 font-bold uppercase tracking-tighter">Course Progress</span>
                                            <span className="text-[#DC5178] font-bold">
                                                {Math.round((progressData.data.progress?.filter(p => p.viewed).length / course.lectures.length) * 100)}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#DC5178] rounded-full transition-all duration-500"
                                                style={{ width: `${(progressData.data.progress?.filter(p => p.viewed).length / course.lectures.length) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                {isEnrolled ? (
                                    <button
                                        onClick={handleEnrollNow}
                                        disabled={isEnrolling}
                                        className="inline-flex items-center justify-center gap-3 px-10 py-4 text-lg font-black text-white bg-[#DC5178] rounded-2xl hover:bg-[#c4456a] transition-all transform hover:scale-[1.02] shadow-xl shadow-[#DC5178]/30 group disabled:opacity-70 disabled:scale-100"
                                    >
                                        <PlayCircle className="group-hover:rotate-12 transition-transform" />
                                        Continue Learning
                                    </button>
                                ) : isPending ? (
                                    <button
                                        disabled
                                        className="inline-flex items-center justify-center gap-3 px-10 py-4 text-lg font-black text-gray-500 bg-gray-100 rounded-2xl cursor-not-allowed shadow-none"
                                    >
                                        <Clock className="animate-pulse" />
                                        Request Pending
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleEnrollNow}
                                        disabled={isEnrolling || isRequesting}
                                        className="inline-flex items-center justify-center gap-3 px-10 py-4 text-lg font-black text-white bg-[#DC5178] rounded-2xl hover:bg-[#c4456a] transition-all transform hover:scale-[1.02] shadow-xl shadow-[#DC5178]/30 group disabled:opacity-70 disabled:scale-100"
                                    >
                                        {(isEnrolling || isRequesting) ? (
                                            <>
                                                <Loader2 className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                {course.course_type === 'free' ? "Enroll Now Free" : "Request Access"}
                                                <span className="text-sm font-normal opacity-80 block sm:hidden md:block ml-1">
                                                    {course.course_price > 0 && `(₹${course.course_price})`}
                                                </span>
                                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                        </div>

                        {/* Right: Preview Card */}
                        <div className="lg:col-span-5 animate-scale">
                            <div className="relative group perspective-1000">
                                <div className="absolute -inset-1 bg-[#DC5178] rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl bg-white border-8 border-white">
                                    {isPlayingPreview && course.lectures?.[0]?.videoUrl ? (
                                        <div className="w-full h-full bg-black">
                                            <video
                                                src={course.lectures[0].videoUrl}
                                                controls
                                                controlsList="nodownload"
                                                onContextMenu={(e) => e.preventDefault()}
                                                autoPlay
                                                className="w-full h-full object-contain"
                                                poster={course.course_thumbnail}
                                            >
                                                {course.lectures[0].subtitles?.en && (
                                                    <track label="English" kind="subtitles" srcLang="en" src={course.lectures[0].subtitles.en} default />
                                                )}
                                                {course.lectures[0].subtitles?.hi && (
                                                    <track label="Hindi" kind="subtitles" srcLang="hi" src={course.lectures[0].subtitles.hi} />
                                                )}
                                                {course.lectures[0].subtitles?.ml && (
                                                    <track label="Malayalam" kind="subtitles" srcLang="ml" src={course.lectures[0].subtitles.ml} />
                                                )}
                                                {course.lectures[0].subtitles?.ta && (
                                                    <track label="Tamil" kind="subtitles" srcLang="ta" src={course.lectures[0].subtitles.ta} />
                                                )}
                                            </video>
                                        </div>
                                    ) : (
                                        <>
                                            {course.course_thumbnail ? (
                                                <Image
                                                    src={course.course_thumbnail}
                                                    alt={course.course_title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#DC5178]/20 to-purple-600/20 flex items-center justify-center">
                                                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                                                        <span className="text-4xl font-bold text-white/40">{course.course_title?.charAt(0) || 'C'}</span>
                                                    </div>
                                                </div>
                                            )}
                                            <div
                                                onClick={() => {
                                                    if (course.lectures?.[0]?.videoUrl) {
                                                        setIsPlayingPreview(true);
                                                    } else {
                                                        handleEnrollNow();
                                                    }
                                                }}
                                                className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all duration-500 cursor-pointer"
                                            >
                                                <div className="w-24 h-24 bg-[#DC5178] rounded-full flex items-center justify-center shadow-2xl shadow-[#DC5178]/50 group-hover:scale-110 transition-transform z-10 relative">
                                                    <div className="absolute inset-0 bg-[#DC5178] rounded-full animate-ping opacity-20 duration-1000"></div>
                                                    <Play className="w-10 h-10 text-white fill-white relative z-10 ml-1" />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div className={`absolute left-6 right-6 p-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl text-white pointer-events-none transition-all duration-500 z-20 ${isPlayingPreview ? "top-6 bottom-auto scale-90 opacity-60" : "bottom-6 top-auto"}`}>
                                        <p className="text-xs font-bold uppercase tracking-wider opacity-80">Course Preview</p>
                                        <p className="text-sm font-medium mt-1">Get a sneak peek into what&aposs inside</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: About & Curriculum */}
                    <div className="lg:col-span-8 space-y-12 animate-fade-up">
                        {/* What you'll learn */}
                        <section className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DC5178]/5 rounded-bl-full pointer-events-none"></div>
                            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#DC5178]/10 flex items-center justify-center">
                                    <CheckCircle2 className="text-[#DC5178] w-6 h-6" />
                                </div>
                                What you&aposll learn
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Master core concepts from ground up",
                                    "Build industry-level real-world projects",
                                    "Learn latest tools and best practices",
                                    "Gain certificate to boost your resume",
                                    "Join a community of 5000+ developers",
                                    "Lifetime access to all updates"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                        <CheckCircle2 className="text-green-500 w-5 h-5 mt-0.5 shrink-0" />
                                        <span className="text-gray-700 font-medium leading-tight">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Description */}
                        <section className="space-y-6">
                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 px-4">
                                <span className="w-1.5 h-8 bg-[#DC5178] rounded-full"></span>
                                Course Description
                            </h3>
                            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed">
                                    <p>{course.description}</p>
                                </div>
                            </div>
                        </section>

                        {/* Curriculum */}
                        <section className="space-y-6">
                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 px-4">
                                <span className="w-1.5 h-8 bg-[#DC5178] rounded-full"></span>
                                Curriculum
                            </h3>
                            <div className="space-y-4">
                                {course.lectures?.length > 0 ? (
                                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                                        <div className="grid gap-4">
                                            {course.lectures.slice(0, 5).map((lecture, lIndex) => {
                                                const isVisiblePreview = lIndex < 2;
                                                const isLocked = !isEnrolled && !lecture.isPreviewFree && !isVisiblePreview;
                                                const isBlurry = !isEnrolled && lIndex >= 2;
                                                const isViewed = progressData?.data?.progress?.find(p => p.lectureId === lecture.id)?.viewed;

                                                return (
                                                    <div key={lecture.id} className="relative">
                                                        <div
                                                            onClick={(!isLocked && !isBlurry) ? () => {
                                                                if (!user) {
                                                                    router.push("/login");
                                                                    return;
                                                                }
                                                                router.push(`/course/${courseId}/lecture/${lecture.id}`);
                                                            } : undefined}
                                                            className={`group flex items-center justify-between p-6 rounded-[2rem] transition-all duration-500 bg-white border border-gray-100/80 shadow-sm ${(!isLocked && !isBlurry)
                                                                ? "hover:border-[#DC5178]/30 hover:shadow-xl hover:shadow-[#DC5178]/5 hover:-translate-y-1 cursor-pointer"
                                                                : "cursor-default"
                                                                } ${isBlurry ? "overflow-hidden" : ""}`}
                                                        >
                                                            <div className={`flex items-center gap-6 w-full ${isBlurry ? "blur-[6px] select-none opacity-40" : ""}`}>
                                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${(!isLocked && !isBlurry && lIndex === 0)
                                                                    ? "bg-[#DC5178] text-white"
                                                                    : (!isLocked && !isBlurry)
                                                                        ? "bg-[#DC5178]/5 text-[#DC5178] group-hover:bg-[#DC5178] group-hover:text-white"
                                                                        : "bg-gray-50 text-gray-300"}`}>
                                                                    <PlayCircle size={24} fill={(!isLocked && !isBlurry && lIndex === 0) ? "white" : "none"} fillOpacity={(!isLocked && !isBlurry && lIndex === 0) ? 0.3 : 1} />
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-3 mb-1.5">
                                                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#DC5178]/50">Lecture 0{lIndex + 1}</span>
                                                                        {isVisiblePreview && (
                                                                            <span className="text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-600 px-3 py-1 rounded-full border border-green-200/30">Free Preview</span>
                                                                        )}
                                                                    </div>
                                                                    <h4 className={`text-lg font-bold transition-colors ${(!isLocked && !isBlurry) ? "text-gray-900 group-hover:text-[#DC5178]" : "text-gray-400"}`}>
                                                                        {lecture.lectureTitle}
                                                                    </h4>
                                                                    <div className="flex items-center gap-5 mt-2.5">
                                                                        <span className="text-xs font-bold text-gray-400 flex items-center gap-2 uppercase tracking-tighter">
                                                                            <Clock size={14} className="text-[#DC5178]/40" /> 12:45
                                                                        </span>
                                                                        <span className="text-xs font-bold text-gray-400 flex items-center gap-2 uppercase tracking-tighter">
                                                                            <MonitorPlay size={14} className="text-[#DC5178]/40" /> Video
                                                                        </span>
                                                                        {isViewed && (
                                                                            <span className="text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-600 px-3 py-1 rounded-full border border-green-200/30 flex items-center gap-1">
                                                                                <CheckCircle2 size={10} /> Completed
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${(!isLocked && !isBlurry && lIndex === 0)
                                                                    ? "bg-[#DC5178] text-white"
                                                                    : (!isLocked && !isBlurry)
                                                                        ? "bg-gray-50 text-gray-300 group-hover:bg-[#DC5178] group-hover:text-white"
                                                                        : "bg-gray-50 text-gray-200"}`}>
                                                                    <ChevronRight size={18} />
                                                                </div>
                                                            </div>

                                                            {isBlurry && (
                                                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/5 backdrop-blur-[1px] rounded-[2rem]">
                                                                    <div className="flex flex-col items-center gap-3 animate-fade-up">
                                                                        <div className="w-12 h-12 rounded-full bg-[#1a1a2e]/90 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 shadow-2xl">
                                                                            <Lock size={20} />
                                                                        </div>
                                                                        <span className="text-[11px] font-black text-[#1a1a2e] uppercase tracking-[0.3em] bg-white/95 backdrop-blur-md px-6 py-2 rounded-full border border-gray-100 shadow-xl">Enroll to unlock</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center space-y-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                            <MonitorPlay className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 font-medium italic">No lectures available for this course yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right: Sidebar Sticky Stuff */}
                    <div className="lg:col-span-4 space-y-8 animate-scale">
                        <div className="sticky top-24 space-y-6">
                            {/* Course Highlights Card */}
                            <div className="bg-[#1a1a2e] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#DC5178]/20 rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
                                <h4 className="text-xl font-black mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#DC5178] flex items-center justify-center">
                                        <Shield size={18} />
                                    </div>
                                    Course Includes
                                </h4>
                                <ul className="space-y-4">
                                    {[
                                        { icon: MonitorPlay, text: "24.5 hours on-demand video" },
                                        { icon: Globe, text: "Full lifetime access" },
                                        { icon: Users, text: "Access on mobile and TV" },
                                        { icon: CheckCircle2, text: "Certificate of completion" }
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-4 group/item">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/item:bg-white/10 transition-colors">
                                                <item.icon className="text-[#DC5178] w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-300 group-hover/item:text-white transition-colors">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Instructor / Support */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Course Instructor</p>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#DC5178]/20 p-1">
                                        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-50">
                                            <Image src="/image/logo.png" alt="Instructor" fill className="object-contain p-2" />
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-black text-gray-900">Stackup Team</h5>
                                        <p className="text-sm text-[#DC5178] font-bold">Expert Instructors</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 font-medium mt-4 line-clamp-3">
                                    Our mission is to empower the next generation of tech leaders through industry-aligned curriculum and expert mentorship.
                                </p>
                                <button className="w-full mt-6 py-3 border border-gray-100 rounded-xl font-bold text-gray-600 hover:bg-[#DC5178]/5 hover:text-[#DC5178] transition-all">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Enrollment */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-100 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrollment Fee</span>
                    <span className="text-xl font-black text-[#DC5178]">
                        {course.course_price > 0 ? `₹${course.course_price}` : "Free Access"}
                    </span>
                </div>
                <button
                    onClick={handleEnrollNow}
                    className="flex-1 py-4 bg-[#DC5178] text-white rounded-2xl font-black shadow-lg shadow-[#DC5178]/30"
                >
                    Get Started Now
                </button>
            </div>
        </div>
    );
};

export default CourseDetail;
