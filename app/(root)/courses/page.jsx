"use client";
import React, { useState, useMemo } from 'react';
import { useGetPublishedCoursesQuery } from '@/feature/api/courseApi';
import { useGetMyEnrolledCoursesQuery } from '@/feature/api/enrollmentApi';
import { useSelector } from 'react-redux';
import CourseCard from '../compoents/CourseCard';
import { Search, LayoutGrid, List, Star, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


const CourseSkeleton = () => {
    return (
        <div className="skeleton-card bg-white rounded-3xl overflow-hidden border border-gray-100 p-4 relative shadow-sm">
            <div className="w-full aspect-video bg-gray-50 rounded-2xl mb-5 relative overflow-hidden">
                <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-[#DC5178]/5 to-transparent -translate-x-full" />
            </div>
            <div className="h-3 bg-gray-50 rounded-full w-1/4 mb-4" />
            <div className="space-y-3 mb-6">
                <div className="h-5 bg-gray-50 rounded-full w-full" />
                <div className="h-5 bg-gray-50 rounded-full w-2/3" />
            </div>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gray-50" />
                <div className="h-4 bg-gray-50 rounded-full w-24" />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="h-6 bg-gray-50 rounded-full w-20" />
                <div className="h-6 bg-gray-50 rounded-full w-16" />
            </div>
        </div>
    );
};

const FilterSection = ({ title, items, selectedItems, onToggle }) => (
    <div className="mb-6 mt-4">
        <h3 className="text-[#1a1a1a] font-semibold text-[15px] mb-4 mt">{title}</h3>
        <div className="space-y-3">
            {items.map((item) => (
                <label key={item.label} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-[18px] h-[18px] border-2 rounded-[3px] flex items-center justify-center transition-all ${selectedItems.includes(item.label)
                            ? 'bg-[#1a1a1a] border-[#1a1a1a]'
                            : 'border-gray-300 group-hover:border-gray-400'
                            }`}>
                            {selectedItems.includes(item.label) && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={selectedItems.includes(item.label)}
                            onChange={() => onToggle(item.label)}
                        />
                        {item.rating ? (
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={14}
                                        className={s <= item.rating ? "fill-[#FFC107] text-[#FFC107]" : "fill-gray-200 text-gray-200"}
                                    />
                                ))}
                            </div>
                        ) : (
                            <span className="text-[14px] text-gray-600">{item.label}</span>
                        )}
                    </div>
                    <span className="text-[14px] text-gray-500">{item.count}</span>
                </label>
            ))}
        </div>
    </div>
);

const CoursesPage = () => {
    const [viewType, setViewType] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isSearching, setIsSearching] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedInstructors, setSelectedInstructors] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState(['All']);
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState([]);

    const { data: allData, isLoading } = useGetPublishedCoursesQuery();
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



    const categories = [
        { label: 'Commercial', count: 15 },
        { label: 'Office', count: 15 },
        { label: 'Shop', count: 15 },
        { label: 'Educate', count: 15 },
        { label: 'Academy', count: 15 },
        { label: 'Single family home', count: 15 },
        { label: 'Studio', count: 15 },
        { label: 'University', count: 15 },
    ];

    const instructors = [
        { label: 'Kenny White', count: 15 },
        { label: 'John Doe', count: 15 },
    ];

    const prices = [
        { label: 'All', count: 15 },
        { label: 'Free', count: 15 },
        { label: 'Paid', count: 15 },
    ];

    const reviews = [
        { rating: 5, count: '(1,025)' },
        { rating: 4, count: '(1,025)' },
        { rating: 3, count: '(1,025)' },
        { rating: 2, count: '(1,025)' },
        { rating: 1, count: '(1,025)' },
    ];

    const levels = [
        { label: 'All levels', count: 15 },
        { label: 'Beginner', count: 15 },
        { label: 'Intermediate', count: 15 },
        { label: 'Expert', count: 15 },
    ];

    const coursesData = allData?.courses;
    const COURSES_PER_PAGE = 6;

    const filteredCourses = useMemo(() => {
        const courses = coursesData || [];
        return courses.filter(course => {
            const matchesSearch = !searchQuery || course.course_title?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(course.category);

            const matchesPrice = selectedPrice.length === 0 ||
                selectedPrice.includes('All') ||
                (selectedPrice.includes('Free') && course.course_type === 'free') ||
                (selectedPrice.includes('Paid') && course.course_type === 'paid');

            const matchesLevel = selectedLevels.length === 0 ||
                selectedLevels.includes('All levels') ||
                selectedLevels.includes(course.level);

            // Assume matches all if no instructors selected or mock logic
            const matchesInstructor = selectedInstructors.length === 0 || selectedInstructors.includes(course.instructor);

            return matchesSearch && matchesCategory && matchesPrice && matchesLevel && matchesInstructor;
        });
    }, [coursesData, searchQuery, selectedCategories, selectedPrice, selectedLevels, selectedInstructors]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);
    const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
    const endIndex = startIndex + COURSES_PER_PAGE;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= maxVisiblePages; i++) {
                    pages.push(i);
                }
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(i);
                }
            }
        }
        return pages;
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setIsSearching(true);
        setTimeout(() => setIsSearching(false), 800);
    };

    // GSAP animations for cards
    useGSAP(() => {
        gsap.fromTo(".shimmer-effect",
            { x: "-100%" },
            { x: "200%", duration: 1.5, repeat: -1, ease: "power2.inOut" }
        );
    }, { dependencies: [isLoading] });

    useGSAP(() => {
        if (!isLoading && !isSearching && paginatedCourses.length > 0) {
            gsap.fromTo(".course-card-anim",
                { opacity: 0, y: 30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" }
            );
        }
    }, { dependencies: [paginatedCourses, isLoading, isSearching] });

    const toggleFilter = (list, setList, item) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    return (
        <div className="min-h-screen pt-40 pb-16 bg-gray-50 mt-8 rounded-3xl">
            <div className="max-w-[1200px] mx-auto px-4">
                <div className="bg-white rounded-3xl p-8 shadow-sm relative overflow-hidden">
                    {/* Futuristic Background Accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#DC5178]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <h1 className="text-[24px] font-bold text-[#1a1a1a]">All Courses</h1>
                            {isSearching && <Loader2 className="animate-spin text-[#DC5178]" size={20} />}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative w-[280px]">
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="w-full bg-transparent border-b border-gray-300 py-2 pl-0 pr-8 focus:outline-none focus:border-[#DC5178] transition-all text-[14px] text-gray-600 placeholder:text-gray-400"
                                />
                                <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewType('grid')}
                                    className={`p-1.5 rounded-lg transition-all ${viewType === 'grid' ? 'bg-[#1a1a1a] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <LayoutGrid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewType('list')}
                                    className={`p-1.5 rounded-lg transition-all ${viewType === 'list' ? 'bg-[#1a1a1a] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10 relative z-10">

                        {/* Main Content */}
                        <div className="flex-1 order-2 lg:order-1">
                            {isLoading || isSearching ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <CourseSkeleton key={i} />
                                    ))}
                                </div>
                            ) : paginatedCourses.length > 0 ? (
                                <div className={`grid gap-6 ${viewType === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                                    {paginatedCourses.map((course, idx) => {
                                        const isEnrolled = enrolledCourseIds.has(course.id);
                                        return (
                                            <div key={course._id || course.id} className="course-card-anim">
                                                <CourseCard
                                                    course={course}
                                                    showProgress={isEnrolled}
                                                    progress={0}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                            ) : (
                                <div className="text-center py-20">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                                    <p className="text-gray-500">Try adjusting your filters or search query.</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-12">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    {getPageNumbers().map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-full text-[14px] font-medium transition-all ${currentPage === page
                                                ? 'bg-[#DC5178] text-white'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="w-full lg:w-[240px] shrink-0 order-1 lg:order-2">
                            <div className="sticky top-28">
                                <FilterSection
                                    title="Course Category"
                                    items={categories}
                                    selectedItems={selectedCategories}
                                    onToggle={(val) => toggleFilter(selectedCategories, setSelectedCategories, val)}
                                />
                                <FilterSection
                                    title="Instructors"
                                    items={instructors}
                                    selectedItems={selectedInstructors}
                                    onToggle={(val) => toggleFilter(selectedInstructors, setSelectedInstructors, val)}
                                />
                                <FilterSection
                                    title="Price"
                                    items={prices}
                                    selectedItems={selectedPrice}
                                    onToggle={(val) => toggleFilter(selectedPrice, setSelectedPrice, val)}
                                />
                                <FilterSection
                                    title="Review"
                                    items={reviews.map(r => ({ ...r, label: `${r.rating} Stars` }))}
                                    selectedItems={selectedReviews}
                                    onToggle={(val) => toggleFilter(selectedReviews, setSelectedReviews, val)}
                                />
                                <FilterSection
                                    title="Level"
                                    items={levels}
                                    selectedItems={selectedLevels}
                                    onToggle={(val) => toggleFilter(selectedLevels, setSelectedLevels, val)}
                                />
                            </div>
                        </aside>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;

