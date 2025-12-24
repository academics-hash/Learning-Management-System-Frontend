"use client";
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MobileNav from './MobileNav'
import { useSelector, useDispatch } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLogoutUserMutation } from '@/feature/api/authApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, User, LogOut, Settings, BookOpen } from 'lucide-react';


import { userLoggedOut } from '@/feature/authSlice';
import { authApi } from '@/feature/api/authApi';

const Navbar = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef(null);
    const [logoutUser, { isLoading }] = useLogoutUserMutation();
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        try {
            await logoutUser().unwrap();
            dispatch(userLoggedOut());
            dispatch(authApi.util.resetApiState());
            toast.success("Logged out successfully");
            // Use window.location.href for a clean reset of all states and caches
            window.location.href = '/';
        } catch (error) {
            // Still clear local state on error
            dispatch(userLoggedOut());
            dispatch(authApi.util.resetApiState());
            window.location.href = '/';
        }
    };

    return (
        <nav className="flex items-center w-full relative mt-5">
            {/* Logo */}
            <div className="shrink-0 z-50">
                <Link href="/"><Image
                    src="/image/logo.png"
                    alt="Logo"
                    width={154}
                    height={39}
                    className="object-contain"
                /> </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-x-10">
                <Link href="/" className="text-white/90 hover:text-white text-[16px] font-semibold leading-[100%] tracking-[0%] transition-colors" style={{ fontFamily: 'Switzer, sans-serif' }}>
                    Home
                </Link>
                <Link href="/about" className="text-white/90 hover:text-white text-[16px] font-normal leading-[100%] tracking-[0%] transition-colors" style={{ fontFamily: 'Switzer, sans-serif' }}>
                    About
                </Link>
                <Link href="/placement" className="text-white/90 hover:text-white text-[16px] font-normal leading-[100%] tracking-[0%] transition-colors" style={{ fontFamily: 'Switzer, sans-serif' }}>
                    Placement
                </Link>
                <Link href="/courses" className="text-white/90 hover:text-white text-[16px] font-normal leading-[100%] tracking-[0%] transition-colors" style={{ fontFamily: 'Switzer, sans-serif' }}>
                    Courses
                </Link>
            </div>

            {/* Desktop Connect Button or Avatar Dropdown */}
            <div className="ml-auto hidden md:block relative" ref={dropdownRef}>
                {!mounted || loading ? (
                    <div className="w-[126px] h-[44px]"></div>
                ) : isAuthenticated ? (
                    <>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="focus:outline-none"
                        >
                            <Avatar className="w-[44px] h-[44px] border border-white/10 hover:border-[#D75287] transition-all cursor-pointer">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="bg-[#1a191f] text-[#D75287] font-bold font-lexend text-lg">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </AvatarFallback>
                            </Avatar>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-[#1a191f] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-100 overflow-hidden backdrop-blur-md">
                                <div className="px-4 py-3 border-b border-white/5">
                                    <p className="text-sm text-gray-400 font-jost">Signed in as</p>
                                    <p className="text-white font-medium truncate font-lexend">{user?.name || 'User'}</p>
                                </div>

                                <div className="p-2">
                                    {(user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'sales') && (
                                        <Link
                                            href={user?.role === 'admin' || user?.role === 'superadmin' ? '/admin' : '/sales'}
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm font-jost"
                                        >
                                            <LayoutDashboard size={16} className="text-[#D75287]" />
                                            {user?.role === 'admin' || user?.role === 'superadmin' ? 'Admin Panel' : 'Sales Dashboard'}
                                        </Link>
                                    )}



                                    <Link
                                        href="/my-learning"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm font-jost"
                                    >
                                        <BookOpen size={16} className="text-[#D75287]" />
                                        My Learning
                                    </Link>
                                </div>


                                <div className="p-2 border-t border-white/5">
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoading}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/5 rounded-lg transition-all text-sm font-jost disabled:opacity-50"
                                    >
                                        <LogOut size={16} />
                                        {isLoading ? 'Logging out...' : 'Sign Out'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <Link
                        href="/contact"
                        className="
              flex items-center justify-center gap-[6px]
              w-[126px] h-[44px]
              bg-[#D75287] hover:bg-[#c74772]
              text-white
              px-[20px] py-[16px]
              rounded-[80px]
              font-medium
              transition-all
              shadow-[0_0_15px_rgba(215,82,135,0.4)]
            "
                        style={{ fontFamily: 'Switzer, sans-serif' }}
                    >
                        Contact Us
                    </Link>
                )}
            </div>


            {/* Mobile Menu Button & Overlay */}
            <MobileNav />
        </nav>
    )
}

export default Navbar