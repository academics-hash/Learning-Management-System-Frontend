"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, Tag, Search, TrendingUp, Clock, FileText, Loader2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useGetAllArticlesQuery } from '@/feature/api/articleApi';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const BlogPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [page, setPage] = useState(1);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch articles from backend - now with server-side search and filters
    const { data, isLoading, isFetching, isError, refetch } = useGetAllArticlesQuery({
        page,
        limit: 12,
        isPublished: true,
        search: debouncedSearchQuery,
        category: selectedCategory
    });

    const articles = data?.articles || [];
    const totalPages = data?.totalPages || 1;

    // Use isFetching for the skeleton during search/filters
    const showSkeleton = isLoading || isFetching;

    // Get categories - if categories are not returned separately, 
    // we use the ones present in current result or a static list
    const categories = ['Technology', 'Software', 'Career', 'Tutorial', 'Google'];


    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const estimateReadTime = (content) => {
        if (!content) return '3 min read';
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `${minutes} min read`;
    };

    // Helper to get image URL with fallback
    const getArticleImage = (image) => {
        if (!image) return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop'; // Premium fallback
        return image;
    };

    // JSON-LD for Blog Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'StackUp Learning Hub Blog',
        description: 'Insights on best software options, Google technologies, and IT careers in Technopark.',
        publisher: {
            '@type': 'Organization',
            name: 'StackUp Learning Hub',
            logo: {
                '@type': 'ImageObject',
                url: 'https://stackuplearning.com/logo.png'
            }
        },
        blogPost: articles.map(post => ({
            '@type': 'BlogPosting',
            headline: post.title,
            image: getArticleImage(post.image),
            datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : '',
            author: {
                '@type': 'Person',
                name: post.author
            },
            description: post.excerpt
        }))
    };

    // Skeleton Card Component
    const SkeletonCard = () => (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden relative flex flex-col h-full group">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-pink-50/50 to-transparent shimmer-effect -translate-x-full z-10" />

            <div className="h-48 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent " />
            </div>
            <div className="p-6 flex flex-col grow">
                <div className="flex gap-4 mb-4">
                    <div className="h-3 w-20 bg-gray-100 rounded" />
                    <div className="h-3 w-20 bg-gray-100 rounded" />
                </div>
                <div className="h-6 w-full bg-gray-100 rounded mb-3" />
                <div className="h-6 w-2/3 bg-gray-100 rounded mb-6" />
                <div className="space-y-2 mb-6 grow">
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-4/5 bg-gray-100 rounded" />
                </div>
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100" />
                        <div className="h-3 w-16 bg-gray-100 rounded" />
                    </div>
                    <div className="h-4 w-20 bg-gray-100 rounded" />
                </div>
            </div>
        </div>
    );

    useGSAP(() => {
        if (showSkeleton) {
            gsap.fromTo(".shimmer-effect",
                { x: "-100%" },
                { x: "200%", duration: 1.5, repeat: -1, ease: "power2.inOut" }
            );
        }
    }, [showSkeleton]);

    return (
        <div className="min-h-screen bg-white font-jost mt-8 rounded-2xl">
            {/* Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="mx-auto max-w-7xl px-6 md:px-12 py-12">

                {/* Header Section */}
                <div className="max-w-3xl mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 mb-6">
                        <TrendingUp size={14} className="text-[#DC5178]" />
                        <span className="text-xs font-semibold text-[#DC5178] uppercase tracking-wider font-lexend">Tech Insights</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-lexend mb-6 leading-tight">
                        Explore the <span className="text-[#DC5178]">Latest</span> in Software & Tech
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        Stay updated with the best software options, Google technology trends, and career insights from the industry experts at Technopark Phase 1.
                    </p>

                    {/* Search Component */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#DC5178] focus:ring-4 focus:ring-pink-500/5 outline-none transition-all"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                {isFetching && searchQuery ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-[#DC5178]" />
                                ) : (
                                    <Search size={20} />
                                )}
                            </div>
                        </div>

                        {/* Category Filter */}
                        {categories.length > 0 && (
                            <select
                                value={selectedCategory}
                                onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-[#DC5178] focus:ring-4 focus:ring-pink-500/5 outline-none transition-all bg-white text-gray-700 font-medium"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {/* Loading State - Skeleton Grid */}
                {showSkeleton && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((idx) => (
                            <SkeletonCard key={idx} />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center max-w-md">
                            <p className="text-red-600 font-medium mb-4">Failed to load articles</p>
                            <button
                                onClick={() => refetch()}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!showSkeleton && !isError && articles.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <FileText size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 font-lexend mb-2">No articles found</h3>
                        <p className="text-gray-500 text-center max-w-md">
                            {searchQuery || selectedCategory
                                ? "Try adjusting your search or filter to find what you're looking for."
                                : "Check back soon for new content!"
                            }
                        </p>
                        {(searchQuery || selectedCategory) && (
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}
                                className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Blog Grid */}
                {!showSkeleton && !isError && articles.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((post, idx) => (
                                <article
                                    key={post.id}
                                    className="blog-card group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-pink-100 transition-all duration-300 flex flex-col h-full"
                                >
                                    {/* Image Wrapper */}
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        <Image
                                            src={getArticleImage(post.image)}
                                            alt={post.title}
                                            fill
                                            unoptimized
                                            priority={idx < 3}
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-[#DC5178] rounded-full shadow-sm uppercase tracking-wide font-lexend">
                                                {post.category || 'General'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col grow">
                                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-lexend">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {formatDate(post.publishedAt || post.createdAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {estimateReadTime(post.content)}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-bold text-gray-900 font-lexend mb-3 group-hover:text-[#DC5178] transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>

                                        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 grow">
                                            {post.excerpt || post.content?.substring(0, 150) + '...'}
                                        </p>

                                        <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                                                    <Image
                                                        src="/image/logo.png"
                                                        alt="StackUp"
                                                        width={24}
                                                        height={24}
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-600">{post.author || 'Admin'}</span>
                                            </div>

                                            <Link
                                                href={`/articles/${post.slug}`}
                                                className="inline-flex items-center gap-1 text-sm font-semibold text-[#DC5178] hover:gap-2 transition-all"
                                            >
                                                Read More <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages >= 1 && (
                            <div className="mt-16 flex flex-col items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${page === 1
                                            ? 'text-gray-300 border-gray-100 cursor-not-allowed'
                                            : 'text-gray-600 border-gray-200 hover:border-[#DC5178] hover:text-[#DC5178]'
                                            }`}
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    <div className="flex items-center gap-1.5">
                                        {[...Array(totalPages)].map((_, i) => {
                                            const pageNum = i + 1;
                                            if (
                                                pageNum === 1 ||
                                                pageNum === totalPages ||
                                                (pageNum >= page - 1 && pageNum <= page + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setPage(pageNum)}
                                                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${page === pageNum
                                                            ? 'bg-linear-to-br from-[#DC5178] to-pink-500 text-white shadow-lg shadow-pink-200/50'
                                                            : 'text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            } else if (
                                                pageNum === page - 2 ||
                                                pageNum === page + 2
                                            ) {
                                                return <span key={pageNum} className="text-gray-400 px-1">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${page === totalPages
                                            ? 'text-gray-300 border-gray-100 cursor-not-allowed'
                                            : 'text-gray-600 border-gray-200 hover:border-[#DC5178] hover:text-[#DC5178]'
                                            }`}
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogPage;

