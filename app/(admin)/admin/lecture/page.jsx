"use client";
import React from "react";
import { useGetCreatorCoursesQuery } from "@/feature/api/courseApi";
import { Folder, BookOpen, Layers, Video, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
    PageHeader,
    Card,
    Button,
    LoadingState,
    ErrorState,
    EmptyState,
    StatCard,
} from "@/app/(admin)/admin/components/AdminUI";

const LectureDashboard = () => {
    const { data, isLoading, error, refetch } = useGetCreatorCoursesQuery();
    const courses = data?.courses || [];

    if (isLoading) return <LoadingState message="Loading courses..." />;
    if (error) return <ErrorState message="Failed to load courses" onRetry={refetch} />;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <PageHeader
                title="Lecture Management"
                description="Select a course to manage its content folders and lectures"
            >
                <Link href="/admin/lecture/create">
                    <Button icon={Plus}>New Lecture</Button>
                </Link>
            </PageHeader>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    title="Total Courses"
                    value={courses.length}
                    icon={BookOpen}
                    variant="pink"
                />
                <StatCard
                    title="Published"
                    value={courses.filter(c => c.is_published).length}
                    icon={Video}
                    variant="emerald"
                />
                <StatCard
                    title="Drafts"
                    value={courses.filter(c => !c.is_published).length}
                    icon={Folder}
                    variant="amber"
                />
            </div>

            {/* Course Grid */}
            {courses.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={BookOpen}
                        title="No Courses Found"
                        description="You need to create a course before adding lectures."
                        action={
                            <Link href="/admin/courses/create">
                                <Button variant="secondary" icon={Plus}>
                                    Create your first course
                                </Button>
                            </Link>
                        }
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/admin/lecture/${course.id}`}
                            className="group"
                        >
                            <Card
                                padding="p-0"
                                hover
                                className="overflow-hidden border-gray-100 hover:border-[#DC5178]/50"
                            >
                                {/* Course Thumbnail */}
                                <div className="aspect-video bg-gray-50 relative overflow-hidden">
                                    {course.course_thumbnail ? (
                                        <Image
                                            src={course.course_thumbnail}
                                            alt={course.course_title}
                                            fill
                                            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen size={48} className="text-gray-200" />
                                        </div>
                                    )}

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Status Badge */}
                                    <div className={`
                                        absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                        ${course.is_published
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm'
                                            : 'bg-amber-50 text-amber-600 border border-amber-100 shadow-sm'
                                        }
                                    `}>
                                        {course.is_published ? 'Published' : 'Draft'}
                                    </div>

                                    {/* Folder Icon */}
                                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2.5 rounded-lg border border-gray-100 text-gray-400 group-hover:text-[#DC5178] transition-all duration-300 shadow-sm">
                                        <Folder size={18} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight font-lexend group-hover:text-[#DC5178] transition-colors line-clamp-2 min-h-[40px]">
                                        {course.course_title}
                                    </h3>
                                </div>

                                {/* Footer */}
                                <div className="px-5 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider font-lexend">
                                        <Layers size={14} className="text-[#DC5178]" />
                                        <span>Manage Content</span>
                                    </div>
                                    <div className="text-[#DC5178] flex items-center gap-1 text-sm font-bold font-lexend">
                                        Open
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LectureDashboard;
