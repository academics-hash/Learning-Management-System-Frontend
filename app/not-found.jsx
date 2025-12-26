"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Image */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-full max-w-sm aspect-square">
                        <Image
                            src="/image/404.gif"
                            alt="404 Error"
                            fill
                            className="object-contain"
                            priority
                            unoptimized
                        />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-5xl font-normal text-gray-800 mb-4">
                    404
                </h1>

                {/* Description */}
                <p className="text-xl text-gray-600 mb-2">
                    That&apos;s an error.
                </p>

                <p className="text-base text-gray-600 mb-8">
                    The requested URL was not found on this server. That&apos;s all we know.
                </p>

                {/* Action Button */}
                <Link href="/">
                    <button className="px-6 py-3 bg-[#1a73e8] text-white text-sm font-medium rounded hover:bg-[#1557b0] transition-colors">
                        Go to Homepage
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
