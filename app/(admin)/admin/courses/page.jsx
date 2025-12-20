"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetCreatorCoursesQuery } from '@/feature/api/courseApi';
import { Plus, Search, Edit, Video, BookOpen, Users, Eye, MoreVertical } from 'lucide-react';
import {
    PageHeader,
    Card,
    Button,
    LoadingState,
    ErrorState,
    EmptyState,
    Badge,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableHeader,
    IconButton,
} from "@/app/(admin)/admin/components/AdminUI";

const CoursesPage = () => {
    const { data, isLoading, isError, refetch } = useGetCreatorCoursesQuery();
    const courses = data?.courses || [];

    if (isLoading) return <LoadingState message="Loading courses..." />;
    if (isError) return <ErrorState message="Failed to load courses" onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <PageHeader
                title="My Courses"
                description="Manage and organize your learning content"
            >
                <Link href="/admin/courses/create">
                    <Button icon={Plus}>Create Course</Button>
                </Link>
            </PageHeader>

            {/* Courses Table */}
            <Card padding="p-0">
                {courses.length === 0 ? (
                    <EmptyState
                        icon={Search}
                        title="No courses found"
                        description="You haven't created any courses yet. Start by creating your first course."
                        action={
                            <Link href="/admin/courses/create">
                                <Button variant="secondary" icon={Plus}>
                                    Create your first course
                                </Button>
                            </Link>
                        }
                    />
                ) : (
                    <Table>
                        <TableHead>
                            <tr>
                                <TableHeader>Course</TableHeader>
                                <TableHeader>Category</TableHeader>
                                <TableHeader>Price</TableHeader>
                                <TableHeader>Status</TableHeader>
                                <TableHeader className="text-right">Actions</TableHeader>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                                {course.course_thumbnail ? (
                                                    <Image
                                                        src={course.course_thumbnail}
                                                        alt={course.course_title}
                                                        width={48}
                                                        height={48}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <BookOpen size={20} className="text-[#DC5178]" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-lexend text-gray-900 dark:text-white text-sm font-bold truncate">
                                                    {course.course_title}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-jost mt-0.5 font-medium">
                                                    {course.course_level || 'All Levels'}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="default">{course.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {course.course_type === 'free' ? (
                                            <Badge variant="success">Free</Badge>
                                        ) : (
                                            <span className="text-gray-900 dark:text-white font-bold font-lexend">
                                                ₹{course.course_price}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={course.is_published ? "info" : "warning"}>
                                            {course.is_published ? "Published" : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/admin/lecture/${course.id}`}>
                                                <IconButton
                                                    icon={Video}
                                                    variant="ghost"
                                                    title="Manage Lectures"
                                                />
                                            </Link>
                                            <Link href={`/admin/courses/${course.id}`}>
                                                <IconButton
                                                    icon={Edit}
                                                    variant="ghost"
                                                    title="Edit Course"
                                                />
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* Course Stats Summary */}
            {courses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="flex items-center gap-4 border-l-4 border-l-[#DC5178]">
                        <div className="p-3 bg-pink-50 rounded-xl transition-colors group-hover:bg-pink-100">
                            <BookOpen className="w-5 h-5 text-[#DC5178]" />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold font-lexend uppercase tracking-wide">Total Courses</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white font-lexend">{courses.length}</p>
                        </div>
                    </Card>
                    <Card className="flex items-center gap-4 border-l-4 border-l-emerald-500">
                        <div className="p-3 bg-emerald-50 rounded-xl">
                            <Eye className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold font-lexend uppercase tracking-wide">Published</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white font-lexend">
                                {courses.filter(c => c.is_published).length}
                            </p>
                        </div>
                    </Card>
                    <Card className="flex items-center gap-4 border-l-4 border-l-amber-500">
                        <div className="p-3 bg-amber-50 rounded-xl">
                            <Edit className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold font-lexend uppercase tracking-wide">Drafts</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white font-lexend">
                                {courses.filter(c => !c.is_published).length}
                            </p>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
