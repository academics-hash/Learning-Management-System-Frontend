"use client";
import React, { useMemo } from 'react'
import CourseCard from './CourseCard'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useGetPublishedCoursesQuery } from '@/feature/api/courseApi';
import { useGetMyEnrolledCoursesQuery } from '@/feature/api/enrollmentApi';

const CourseSelection = () => {
    const { data, isLoading, error } = useGetPublishedCoursesQuery();
    const { user } = useSelector((state) => state.auth);
    const { data: enrolledData } = useGetMyEnrolledCoursesQuery(undefined, { skip: !user });

    // Create a set of enrolled course IDs for quick lookup
    const enrolledCourseIds = useMemo(() => {
        const ids = new Set();
        if (enrolledData?.courses) {
            enrolledData.courses.forEach(course => ids.add(course.id));
        }
        return ids;
    }, [enrolledData]);

    if (isLoading) return <div>Loading...</div>; // Or a nice skeleton
    if (error) return <div>Error loading courses</div>;

    const courses = data?.courses || [];
    return (
        <section className="w-full flex justify-center px-4 md:px-0 mt-24 md:mt-32 lg:mt-8 mb-16">
            <div className="w-full max-w-[1784px] min-h-[500px] h-auto bg-[#FFFFFF] rounded-[40px] relative z-10 p-6 md:p-14 flex flex-col justify-center">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 md:mb-16 gap-6">
                    <div className="max-w-[511px]">
                        <h2 className="text-[28px] md:text-[40px] leading-[136%] font-medium text-[#1A0B10] font-montserrat tracking-[-0.04em] capitalize">
                            Level Up With Free <br className="hidden md:block" />
                            Beginner-Friendly Courses
                        </h2>
                    </div>
                    <div>
                        <Link
                            href="/courses"
                            className="flex items-center justify-center w-[161px] h-[44px] gap-[6px] rounded-[80px] bg-[#D75287] text-white px-[20px] py-[16px] hover:bg-[#c44a7b] transition-all font-medium font-inter text-sm"
                        >
                            View All Courses
                        </Link>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {courses.map(course => {
                        const isEnrolled = enrolledCourseIds.has(course.id);
                        return (
                            <CourseCard
                                key={course.id}
                                course={course}
                                showProgress={isEnrolled}
                                progress={0}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    )
}

export default CourseSelection

