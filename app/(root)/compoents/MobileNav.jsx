'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="ml-auto md:hidden z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/95 z-40 flex flex-col items-center justify-center space-y-6 md:hidden">
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="text-white text-lg font-semibold hover:text-[#DC5178] transition-colors"
                        style={{ fontFamily: 'Switzer, sans-serif' }}
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        onClick={() => setIsOpen(false)}
                        className="text-white text-lg font-medium hover:text-[#DC5178] transition-colors"
                        style={{ fontFamily: 'Switzer, sans-serif' }}
                    >
                        About
                    </Link>
                    <Link
                        href="/placement"
                        onClick={() => setIsOpen(false)}
                        className="text-white text-lg font-medium hover:text-[#DC5178] transition-colors"
                        style={{ fontFamily: 'Switzer, sans-serif' }}
                    >
                        Placement
                    </Link>
                    <Link
                        href="/courses"
                        onClick={() => setIsOpen(false)}
                        className="text-white text-lg font-medium hover:text-[#DC5178] transition-colors"
                        style={{ fontFamily: 'Switzer, sans-serif' }}
                    >
                        Courses
                    </Link>

                    {mounted && !loading && (
                        isAuthenticated ? (
                            <div className="flex flex-col items-center gap-4">
                                {(user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'sales') && (
                                    <Link
                                        href={user?.role === 'admin' || user?.role === 'superadmin' ? '/admin' : '/sales'}
                                        onClick={() => setIsOpen(false)}
                                        className="text-white text-lg font-medium hover:text-[#DC5178] transition-colors"
                                    >
                                        {user?.role === 'admin' || user?.role === 'superadmin' ? 'Admin Panel' : 'Sales Dashboard'}
                                    </Link>
                                )}
                                <div className="flex flex-col items-center gap-2">
                                    <Avatar className="w-16 h-16 border-2 border-[#DC5178]">
                                        <AvatarImage src={user?.avatar} />
                                        <AvatarFallback className="bg-[#1a191f] text-[#DC5178] text-xl font-bold font-lexend">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-white font-medium font-switzer">{user?.name || 'User'}</span>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="bg-[#DC5178] hover:bg-[#c03e63] text-white px-6 py-2.5 rounded-full font-medium text-base transition-all shadow-[0_0_15px_rgba(220,81,120,0.4)]"
                                style={{ fontFamily: 'Switzer, sans-serif' }}
                            >
                                Contact Us
                            </Link>
                        )
                    )}
                </div>
            )}
        </div>
    )
}

export default MobileNav
