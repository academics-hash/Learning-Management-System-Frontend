"use client";
import React, { useState, useMemo, useRef } from 'react';
import { useGetPublishedCoursesQuery } from '@/feature/api/courseApi';
import { useGetMyEnrolledCoursesQuery } from '@/feature/api/enrollmentApi';
import { useSelector } from 'react-redux';
import CourseCard from '../compoents/CourseCard';
import { Search, LayoutGrid, List, Star, ChevronLeft, ChevronRight, Loader2, Filter, BookOpen, Sparkles, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


const CourseSkeleton = () => {
    return (
        <div className="skeleton-card bg-white rounded-2xl overflow-hidden border border-gray-100/80 p-5 relative group">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-50/50 to-transparent shimmer-effect -translate-x-full" />

            {/* Image placeholder */}
            <div className="w-full aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
            </div>

            {/* Category tag */}
            <div className="h-5 bg-gray-100 rounded-full w-20 mb-4" />

            {/* Title */}
            <div className="space-y-2.5 mb-5">
                <div className="h-5 bg-gray-100 rounded-lg w-full" />
                <div className="h-5 bg-gray-100 rounded-lg w-3/4" />
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-100 to-gray-100" />
                <div className="h-4 bg-gray-100 rounded-lg w-28" />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="h-7 bg-gray-100 rounded-lg w-24" />
                <div className="h-9 bg-gradient-to-r from-pink-100 to-pink-50 rounded-full w-20" />
            </div>
        </div>
    );
};

const FilterSection = ({ title, items, selectedItems, onToggle, isOpen, onToggleOpen }) => (
    <div className="mb-2">
        <button
            onClick={onToggleOpen}
            className="w-full flex items-center justify-between py-3 group"
        >
            <h3 className="text-gray-900 font-semibold text-sm font-lexend tracking-wide">{title}</h3>
            <ChevronRight
                size={16}
                className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''} group-hover:text-[#DC5178]`}
            />
        </button>
        <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 pb-3' : 'max-h-0 opacity-0'}`}>
            {items.map((item) => (
                <label
                    key={item.label}
                    className="flex items-center justify-between py-2 px-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-pink-50/50 group"
                >
                    <div className="flex items-center gap-3">
                        <div className={`
                            w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 border-2
                            ${selectedItems.includes(item.label)
                                ? 'bg-[#DC5178] border-[#DC5178] shadow-sm shadow-pink-200'
                                : 'border-gray-200 group-hover:border-[#DC5178]/50 bg-white'
                            }
                        `}>
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
                                        className={s <= item.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
                                    />
                                ))}
                            </div>
                        ) : (
                            <span className="text-sm text-gray-600 font-jost font-medium">{item.label}</span>
                        )}
                    </div>
                    <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">{item.count}</span>
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
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedInstructors, setSelectedInstructors] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState(['All']);
    const [selectedLevels, setSelectedLevels] = useState([]);

    // Filter section open states
    const [openFilters, setOpenFilters] = useState({
        category: true,
        instructors: false,
        price: true,
        level: true
    });

    const { data: allData, isLoading } = useGetPublishedCoursesQuery();
    const { user } = useSelector((state) => state.auth);
    const { data: enrolledData } = useGetMyEnrolledCoursesQuery(undefined, { skip: !user });

    const containerRef = useRef(null);

    // Create a map of enrolled courses for quick lookup and progress info
    const enrolledInfo = useMemo(() => {
        const map = new Map();
        if (enrolledData?.courses) {
            enrolledData.courses.forEach(course => map.set(course.id, course));
        }
        return map;
    }, [enrolledData]);



    const coursesData = useMemo(() => allData?.courses || [], [allData]);
    const COURSES_PER_PAGE = 6;

    // Derived Filters
    const categories = useMemo(() => {
        const categoryMap = new Map();
        coursesData.forEach(course => {
            if (course.category) {
                const normalized = course.category.trim().toLowerCase();
                if (categoryMap.has(normalized)) {
                    categoryMap.get(normalized).count += 1;
                } else {
                    categoryMap.set(normalized, { label: course.category.trim(), count: 1 });
                }
            }
        });
        return Array.from(categoryMap.values());
    }, [coursesData]);

    const instructors = useMemo(() => {
        const instructorMap = new Map();
        coursesData.forEach(course => {
            let name = course.creator?.name || 'Unknown Instructor';
            if (name.trim().toLowerCase() === 'super admin') {
                name = 'StackUp';
            }
            const normalized = name.trim().toLowerCase();

            if (instructorMap.has(normalized)) {
                instructorMap.get(normalized).count += 1;
            } else {
                instructorMap.set(normalized, { label: name.trim(), count: 1 });
            }
        });
        return Array.from(instructorMap.values());
    }, [coursesData]);

    const levels = useMemo(() => {
        const counts = {};
        coursesData.forEach(course => {
            const lvl = course.course_level || 'Unspecified';
            counts[lvl] = (counts[lvl] || 0) + 1;
        });
        return [
            { label: 'All levels', count: coursesData.length },
            ...Object.entries(counts).map(([label, count]) => ({ label, count }))
        ];
    }, [coursesData]);

    const prices = useMemo(() => {
        const freeCount = coursesData.filter(c => c.course_type === 'free').length;
        const paidCount = coursesData.filter(c => c.course_type === 'paid').length;
        return [
            { label: 'All', count: coursesData.length },
            { label: 'Free', count: freeCount },
            { label: 'Paid', count: paidCount },
        ];
    }, [coursesData]);

    const filteredCourses = useMemo(() => {
        const courses = coursesData || [];
        return courses.filter(course => {
            const matchesSearch = !searchQuery || course.course_title?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategories.length === 0 ||
                selectedCategories.some(c => c.toLowerCase() === course.category?.trim().toLowerCase());

            const matchesPrice = selectedPrice.length === 0 ||
                selectedPrice.includes('All') ||
                (selectedPrice.includes('Free') && course.course_type === 'free') ||
                (selectedPrice.includes('Paid') && course.course_type === 'paid');

            const matchesLevel = selectedLevels.length === 0 ||
                selectedLevels.includes('All levels') ||
                selectedLevels.includes(course.course_level);

            const matchesInstructor = selectedInstructors.length === 0 ||
                selectedInstructors.some(i => {
                    let name = course.creator?.name || 'Unknown Instructor';
                    if (name.trim().toLowerCase() === 'super admin') {
                        name = 'StackUp';
                    }
                    return i.toLowerCase() === name.trim().toLowerCase();
                });

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

    const toggleFilterSection = (section) => {
        setOpenFilters(prev => ({ ...prev, [section]: !prev[section] }));
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
                { opacity: 0, y: 40, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" }
            );
        }
    }, { dependencies: [paginatedCourses, isLoading, isSearching] });

    // Page entrance animation
    useGSAP(() => {
        gsap.fromTo(".page-header",
            { opacity: 0, y: -30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
        gsap.fromTo(".filter-sidebar",
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
        );
    }, { scope: containerRef });

    const toggleFilter = (list, setList, item) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const activeFiltersCount = selectedCategories.length +
        (selectedPrice.filter(p => p !== 'All').length) +
        selectedLevels.filter(l => l !== 'All levels').length +
        selectedInstructors.length;

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedInstructors([]);
        setSelectedPrice(['All']);
        setSelectedLevels([]);
    };

    return (
        <div ref={containerRef} className="min-h-screen pt-32 pb-20 bg-white rounded-2xl mt-6 mx-auto max-w-[1600px]">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Decorative Background Elements */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-pink-100/40 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
                <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-100/30 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

                {/* Page Header */}
                <div className="page-header mb-10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DC5178] to-pink-400 flex items-center justify-center shadow-lg shadow-pink-200/50">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xs font-bold text-[#DC5178] bg-pink-50 px-3 py-1 rounded-full font-lexend uppercase tracking-wider">
                                    Explore & Learn
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-lexend mb-2">
                                All Courses
                            </h1>
                            <p className="text-gray-500 font-jost text-base">
                                Discover {filteredCourses.length} courses to accelerate your learning journey
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            {/* Search Input */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-indigo-100 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-sm" />
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="w-full sm:w-72 bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#DC5178] focus:ring-4 focus:ring-[#DC5178]/10 transition-all text-sm text-gray-700 placeholder:text-gray-400 font-jost"
                                    />
                                    <div className="absolute left-4 text-gray-400">
                                        {isSearching ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-[#DC5178]" />
                                        ) : (
                                            <Search className="w-5 h-5" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* View Toggle & Filter Button */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
                                    <button
                                        onClick={() => setViewType('grid')}
                                        className={`p-2.5 rounded-lg transition-all ${viewType === 'grid'
                                            ? 'bg-gray-900 text-white shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewType('list')}
                                        className={`p-2.5 rounded-lg transition-all ${viewType === 'list'
                                            ? 'bg-gray-900 text-white shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>

                                {/* Mobile Filter Toggle */}
                                <button
                                    onClick={() => setShowMobileFilter(true)}
                                    className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 font-medium text-sm hover:border-[#DC5178] transition-colors"
                                >
                                    <Filter size={18} />
                                    <span>Filters</span>
                                    {activeFiltersCount > 0 && (
                                        <span className="bg-[#DC5178] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Main Content */}
                    <div className="flex-1 order-2 lg:order-1">
                        {/* Results Info Bar */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <p className="text-sm text-gray-500 font-jost">
                                Showing <span className="font-semibold text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredCourses.length)}</span> of <span className="font-semibold text-gray-900">{filteredCourses.length}</span> courses
                            </p>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-[#DC5178] hover:text-pink-700 font-medium flex items-center gap-1 transition-colors"
                                >
                                    <X size={14} />
                                    Clear all filters
                                </button>
                            )}
                        </div>

                        {isLoading || isSearching ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <CourseSkeleton key={i} />
                                ))}
                            </div>
                        ) : paginatedCourses.length > 0 ? (
                            <div className={`grid gap-6 ${viewType === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                                {paginatedCourses.map((course, idx) => {
                                    const enrolledCourse = enrolledInfo.get(course.id);
                                    const isEnrolled = !!enrolledCourse;
                                    const progress = enrolledCourse?.progress || 0;

                                    return (
                                        <div key={course._id || course.id} className="course-card-anim">
                                            <CourseCard
                                                course={course}
                                                showProgress={isEnrolled}
                                                progress={progress}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                        ) : (
                            <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
                                    <Sparkles className="w-10 h-10 text-[#DC5178]" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 font-lexend">No courses found</h3>
                                <p className="text-gray-500 font-jost max-w-sm mx-auto">Try adjusting your filters or search query to discover more courses.</p>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="mt-6 inline-flex items-center gap-2 bg-[#DC5178] text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-pink-600 transition-colors shadow-sm shadow-pink-200"
                                    >
                                        <X size={16} />
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages >= 1 && (
                            <div className="flex justify-center items-center gap-1.5 mt-14">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${currentPage === 1
                                        ? 'text-gray-300 border-gray-100 cursor-not-allowed'
                                        : 'text-gray-600 border-gray-200 hover:border-[#DC5178] hover:text-[#DC5178]'
                                        }`}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                {getPageNumbers().map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${currentPage === page
                                            ? 'bg-gradient-to-br from-[#DC5178] to-pink-500 text-white shadow-lg shadow-pink-200/50'
                                            : 'text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${currentPage === totalPages
                                        ? 'text-gray-300 border-gray-100 cursor-not-allowed'
                                        : 'text-gray-600 border-gray-200 hover:border-[#DC5178] hover:text-[#DC5178]'
                                        }`}
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Desktop Sidebar */}
                    <aside className="filter-sidebar hidden lg:block w-[280px] shrink-0 order-1 lg:order-2">
                        <div className="sticky top-28">
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Filter size={18} className="text-[#DC5178]" />
                                        <h2 className="text-lg font-bold text-gray-900 font-lexend">Filters</h2>
                                    </div>
                                    {activeFiltersCount > 0 && (
                                        <span className="text-xs font-bold text-[#DC5178] bg-pink-50 px-2.5 py-1 rounded-full">
                                            {activeFiltersCount} active
                                        </span>
                                    )}
                                </div>

                                <FilterSection
                                    title="Category"
                                    items={categories}
                                    selectedItems={selectedCategories}
                                    onToggle={(val) => toggleFilter(selectedCategories, setSelectedCategories, val)}
                                    isOpen={openFilters.category}
                                    onToggleOpen={() => toggleFilterSection('category')}
                                />
                                <div className="border-t border-gray-100" />
                                <FilterSection
                                    title="Instructors"
                                    items={instructors}
                                    selectedItems={selectedInstructors}
                                    onToggle={(val) => toggleFilter(selectedInstructors, setSelectedInstructors, val)}
                                    isOpen={openFilters.instructors}
                                    onToggleOpen={() => toggleFilterSection('instructors')}
                                />
                                <div className="border-t border-gray-100" />
                                <FilterSection
                                    title="Price"
                                    items={prices}
                                    selectedItems={selectedPrice}
                                    onToggle={(val) => toggleFilter(selectedPrice, setSelectedPrice, val)}
                                    isOpen={openFilters.price}
                                    onToggleOpen={() => toggleFilterSection('price')}
                                />
                                <div className="border-t border-gray-100" />
                                <FilterSection
                                    title="Level"
                                    items={levels}
                                    selectedItems={selectedLevels}
                                    onToggle={(val) => toggleFilter(selectedLevels, setSelectedLevels, val)}
                                    isOpen={openFilters.level}
                                    onToggleOpen={() => toggleFilterSection('level')}
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Filter Drawer */}
                    {showMobileFilter && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div
                                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                                onClick={() => setShowMobileFilter(false)}
                            />
                            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
                                <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Filter size={18} className="text-[#DC5178]" />
                                        <h2 className="text-lg font-bold text-gray-900 font-lexend">Filters</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowMobileFilter(false)}
                                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <FilterSection
                                        title="Category"
                                        items={categories}
                                        selectedItems={selectedCategories}
                                        onToggle={(val) => toggleFilter(selectedCategories, setSelectedCategories, val)}
                                        isOpen={openFilters.category}
                                        onToggleOpen={() => toggleFilterSection('category')}
                                    />
                                    <div className="border-t border-gray-100" />
                                    <FilterSection
                                        title="Instructors"
                                        items={instructors}
                                        selectedItems={selectedInstructors}
                                        onToggle={(val) => toggleFilter(selectedInstructors, setSelectedInstructors, val)}
                                        isOpen={openFilters.instructors}
                                        onToggleOpen={() => toggleFilterSection('instructors')}
                                    />
                                    <div className="border-t border-gray-100" />
                                    <FilterSection
                                        title="Price"
                                        items={prices}
                                        selectedItems={selectedPrice}
                                        onToggle={(val) => toggleFilter(selectedPrice, setSelectedPrice, val)}
                                        isOpen={openFilters.price}
                                        onToggleOpen={() => toggleFilterSection('price')}
                                    />
                                    <div className="border-t border-gray-100" />
                                    <FilterSection
                                        title="Level"
                                        items={levels}
                                        selectedItems={selectedLevels}
                                        onToggle={(val) => toggleFilter(selectedLevels, setSelectedLevels, val)}
                                        isOpen={openFilters.level}
                                        onToggleOpen={() => toggleFilterSection('level')}
                                    />
                                </div>
                                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3">
                                    <button
                                        onClick={clearAllFilters}
                                        className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        onClick={() => setShowMobileFilter(false)}
                                        className="flex-1 py-3 rounded-xl bg-[#DC5178] text-white font-medium text-sm hover:bg-pink-600 transition-colors shadow-sm shadow-pink-200"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CoursesPage;
