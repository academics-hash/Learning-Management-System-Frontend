"use client";
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowLeft, Tag, Clock, Share2, FileText, Loader2 } from 'lucide-react';
import { useGetArticleBySlugQuery } from '@/feature/api/articleApi';

const ArticleDetailPage = () => {
    const { slug } = useParams();

    const { data, isLoading, isError, refetch } = useGetArticleBySlugQuery(slug);
    const article = data?.article;


    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const estimateReadTime = (content) => {
        if (!content) return '3 min read';
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `${minutes} min read`;
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-[#DC5178] mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading article...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (isError || !article) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText size={40} className="text-gray-300" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 font-lexend mb-3">Article Not Found</h1>
                    <p className="text-gray-500 mb-6">
                        The article you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Link
                        href="/articles"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#DC5178] hover:bg-[#c03e62] text-white font-semibold rounded-xl transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Articles
                    </Link>
                </div>
            </div>
        );
    }

    // JSON-LD for Article
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        image: article.image,
        datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : '',
        dateModified: article.updatedAt ? new Date(article.updatedAt).toISOString() : '',
        author: {
            '@type': 'Person',
            name: article.author
        },
        publisher: {
            '@type': 'Organization',
            name: 'StackUp Learning Hub',
            logo: {
                '@type': 'ImageObject',
                url: 'https://stackuplearning.com/logo.png'
            }
        },
        description: article.excerpt
    };

    return (
        <div className="min-h-screen bg-white font-jost mt-8 rounded-2xl">
            {/* Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="mx-auto max-w-7xl px-6 md:px-12 py-12">
                {/* Back Link */}
                <Link
                    href="/articles"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-[#DC5178] transition-colors mb-8 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold text-sm">Back to Articles</span>
                </Link>

                <div className="max-w-4xl mx-auto">
                    {/* Category Badge */}
                    <div className="mb-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100">
                            <Tag size={14} className="text-[#DC5178]" />
                            <span className="text-xs font-semibold text-[#DC5178] uppercase tracking-wider font-lexend">
                                {article.category || 'General'}
                            </span>
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 font-lexend mb-6 leading-tight">
                        {article.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                                <Image
                                    src="/image/logo.png"
                                    alt="StackUp"
                                    width={28}
                                    height={28}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{article.author || 'Admin'}</p>
                                <p className="text-xs text-gray-400">Author</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-gray-400" />
                            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={16} className="text-gray-400" />
                            <span>{estimateReadTime(article.content)}</span>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-10">
                        <Image
                            src={article.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop'}
                            alt={article.title}
                            fill
                            unoptimized
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <div className="bg-gray-50 border-l-4 border-[#DC5178] rounded-r-xl p-6 mb-10">
                            <p className="text-lg text-gray-700 italic leading-relaxed">
                                {article.excerpt}
                            </p>
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg max-w-none prose-headings:font-lexend prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#DC5178] prose-a:no-underline hover:prose-a:underline">
                        {article.content?.split('\n').map((paragraph, index) => (
                            paragraph.trim() && (
                                <p key={index} className="mb-4 text-gray-600 leading-relaxed">
                                    {paragraph}
                                </p>
                            )
                        ))}
                    </div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 font-lexend">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full hover:bg-pink-50 hover:text-[#DC5178] transition-colors cursor-pointer"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Share Section */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1 font-lexend">Share this article</h3>
                                <p className="text-sm text-gray-500">Help others discover this content</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: article.title,
                                            text: article.excerpt,
                                            url: window.location.href
                                        });
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Link copied to clipboard!');
                                    }
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-pink-50 text-gray-600 hover:text-[#DC5178] font-semibold rounded-xl transition-colors"
                            >
                                <Share2 size={18} />
                                Share
                            </button>
                        </div>
                    </div>

                    {/* Back to Articles CTA */}
                    <div className="mt-16 bg-gradient-to-r from-pink-50 to-white border border-pink-100 rounded-2xl p-8 text-center">
                        <h3 className="text-xl font-bold text-gray-900 font-lexend mb-3">
                            Enjoyed this article?
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Explore more insights and tutorials from our team.
                        </p>
                        <Link
                            href="/articles"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC5178] hover:bg-[#c03e62] text-white font-semibold rounded-xl transition-colors shadow-sm shadow-pink-200"
                        >
                            Browse All Articles
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetailPage;
