"use client";
import React from "react";
import { useSelector } from "react-redux";
import { useGetMyEnrolledCoursesQuery } from "@/feature/api/enrollmentApi";
import CourseCard from "../compoents/CourseCard";
import Image from "next/image";
import { User, Mail, Shield, BookOpen, GraduationCap, Settings, LogOut, ChevronRight, CheckCircle2, Calendar, Loader2 } from "lucide-react";


import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetMyEnrolledCoursesQuery();

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from(".profile-header", {
            y: -30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        })
            .from(".profile-card", {
                x: -30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.4")
            .from(".my-learning-section", {
                x: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.6");
    }, []);

    const enrolledCourses = data?.courses || [];

    return (
        <div className="min-h-screen bg-white mt-8 rounded-[24px] pt-16 pb-20 px-4 md:px-8 border border-gray-100 shadow-sm">


            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="profile-header mb-12">
                    <h1 className="text-4xl font-black text-gray-900 font-lexend tracking-tight">
                        Account <span className="text-[#DC5178]">Profile</span>
                    </h1>
                    <p className="text-gray-500 font-jost text-lg mt-2 font-medium">Manage your personal information and track your learning progress.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: User Card */}
                    <div className="lg:col-span-4 space-y-6 profile-card">
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-10 text-center relative">
                            <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-[#DC5178]/5 to-transparent"></div>

                            <div className="relative mb-6">
                                <div className="w-24 h-24 mx-auto rounded-full p-1 border-4 border-pink-50 ring-4 ring-[#DC5178]/10 overflow-hidden bg-white shadow-xl relative z-10">
                                    <Image
                                        src={user?.avatar || "/image/logo.png"}
                                        alt={user?.name || "User"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-2 right-1/2 translate-x-[40px] w-8 h-8 bg-[#DC5178] rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg">
                                    <CheckCircle2 size={14} fill="white" fillOpacity={0.2} />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 font-lexend">{user?.name || "Student"}</h2>
                            <p className="text-[#DC5178] font-bold font-jost uppercase tracking-widest text-xs mt-1">{user?.role || "Student"}</p>

                            <div className="mt-10 space-y-4 text-left">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                                    <Mail className="text-[#DC5178] w-5 h-5 opacity-40" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-bold text-gray-700">{user?.email || "student@stackup.com"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                                    <Shield className="text-[#DC5178] w-5 h-5 opacity-40" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Status</p>
                                        <p className="text-sm font-bold text-gray-700">Verified Professional</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-black font-lexend hover:bg-black transition-colors flex items-center justify-center gap-2 group">
                                <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                                Edit Account Settings
                            </button>
                        </div>
                    </div>

                    {/* Right: My Learning Section */}
                    <div className="lg:col-span-8 my-learning-section">
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 min-h-[500px]">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center shadow-sm">
                                        <GraduationCap className="text-[#DC5178] w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 font-lexend tracking-tight">My Learning Journey</h3>
                                        <p className="text-sm text-gray-500 font-jost font-medium">You have <span className="text-[#DC5178] font-bold">{enrolledCourses.length}</span> active enrollments</p>
                                    </div>
                                </div>
                                <Link
                                    href="/my-learning"
                                    className="text-sm font-black text-[#DC5178] hover:text-[#c4456a] group flex items-center gap-1 uppercase tracking-widest"
                                >
                                    View Full Dashboard
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-10 h-10 animate-spin text-[#DC5178]" />
                                    <p className="mt-4 text-gray-400 font-medium">Fetching your courses...</p>
                                </div>
                            ) : enrolledCourses.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                                    <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <h4 className="text-lg font-bold text-gray-900 font-lexend">No enrollments yet</h4>
                                    <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2">Start your first course today and build your skills with our expert programs.</p>
                                    <Link href="/courses" className="mt-6 inline-flex px-8 py-3 bg-[#DC5178] text-white rounded-xl font-bold shadow-lg shadow-pink-100 hover:scale-105 transition-transform">Explore Courses</Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {enrolledCourses.slice(0, 4).map((course) => (
                                        <Link
                                            key={course.id}
                                            href={`/course/${course.id}`}
                                            className="group relative bg-[#fafafa] rounded-3xl p-6 border border-gray-100 hover:border-[#DC5178]/20 transition-all hover:shadow-xl hover:shadow-[#DC5178]/5 hover:-translate-y-1 block"
                                        >
                                            <div className="flex gap-4 items-center">
                                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm shrink-0">
                                                    <Image src={course.course_thumbnail} alt={course.course_title} fill className="object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[9px] font-black text-[#DC5178] uppercase tracking-widest bg-[#DC5178]/5 px-2 py-0.5 rounded-full border border-[#DC5178]/10">{course.category}</span>
                                                    </div>
                                                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#DC5178] transition-colors line-clamp-1 font-lexend">{course.course_title}</h4>
                                                    <div className="flex items-center gap-3 mt-1.5 opacity-60">
                                                        <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                                            <Calendar size={10} /> 2 Weeks
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                                            <CheckCircle2 size={10} className="text-green-500" /> Active
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-6 right-6 p-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-all shadow-md group-hover:translate-x-1">
                                                <ChevronRight size={14} className="text-[#DC5178]" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {enrolledCourses.length > 4 && (
                                <div className="mt-12 text-center">
                                    <Link
                                        href="/my-learning"
                                        className="inline-flex items-center gap-2 px-10 py-4 bg-gray-50 text-gray-900 rounded-2xl font-black font-lexend hover:bg-gray-100 transition-colors"
                                    >
                                        See All {enrolledCourses.length} Courses
                                        <ChevronRight size={18} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
