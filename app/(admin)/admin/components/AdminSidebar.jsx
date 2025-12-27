"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, Video, Users, Settings, Sun, Moon, MessageSquare, ChevronLeft, ChevronRight, Menu, Shield, Briefcase, GraduationCap, Clock, FileText, Mail } from 'lucide-react';
import { useTheme } from "next-themes";
import React, { useState, useEffect, useRef } from 'react';
import { useLogoutUserMutation } from '@/feature/api/authApi';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BiLoaderAlt } from 'react-icons/bi';
import { MdLogout } from "react-icons/md";
import { userLoggedOut } from '@/feature/authSlice';
import { authApi } from '@/feature/api/authApi';
import { useGetPendingEnrollmentsQuery } from '@/feature/api/enrollmentApi';
import Image from "next/image";

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const router = useRouter();
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [logoutUser, { isLoading }] = useLogoutUserMutation();
    const { user } = useSelector((state) => state.auth);
    const sidebarRef = useRef(null);

    // Fetch pending requests for badge count
    const { data: pendingData } = useGetPendingEnrollmentsQuery(undefined, {
        skip: !user || user.role === 'user',
        pollingInterval: 30000, // Refresh every 30 seconds
    });
    const pendingCount = pendingData?.enrollments?.length || 0;

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        let lenis;
        if (typeof window !== 'undefined' && sidebarRef.current) {
            import('lenis').then((LenisModule) => {
                const Lenis = LenisModule.default;
                lenis = new Lenis({
                    wrapper: sidebarRef.current,
                    content: sidebarRef.current.firstChild,
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    direction: 'vertical',
                    gestureDirection: 'vertical',
                    smooth: true,
                    mouseMultiplier: 1,
                    touchMultiplier: 2,
                });

                function raf(time) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }

                requestAnimationFrame(raf);
            });
        }

        return () => {
            if (lenis) lenis.destroy();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(userLoggedOut());
            dispatch(authApi.util.resetApiState());
            toast.success("Logged out successfully");
            // Use window.location.assign for a clean logout and transition to login
            window.location.assign('/login');
        } catch (error) {
            console.error("Logout failed", error);
            // Still clear local state and redirect on error
            dispatch(userLoggedOut());
            dispatch(authApi.util.resetApiState());
            window.location.assign('/login');
        }
    };

    const links = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Courses", href: "/admin/courses", icon: BookOpen },
        { name: "Lectures", href: "/admin/lecture", icon: Video },
        { name: "Employees", href: "/admin/employees", icon: Shield },
        { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Enrollments", href: "/admin/enrollments", icon: GraduationCap },
        { name: "Course Requests", href: "/admin/enrollments/requests", icon: Clock },
        { name: "Placements", href: "/admin/placements", icon: Briefcase },
        { name: "Articles", href: "/admin/articles", icon: FileText },
        { name: "Contact Details", href: "/admin/contacts", icon: Mail },
        { name: "Settings", href: "/admin/settings", icon: Settings },

    ];

    return (
        <div
            ref={sidebarRef}
            className={`bg-white dark:bg-gray-900 h-full border-r border-gray-100 dark:border-gray-800 flex flex-col overflow-y-auto transition-all duration-300 shadow-sm no-scrollbar ${isCollapsed ? "w-[80px]" : "w-full"
                }`}
        >
            <div className="flex flex-col min-h-full">
                {/* Logo & Toggle */}
                <div className={`h-16 flex items-center border-b border-gray-50 dark:border-gray-800 px-4 justify-between bg-white dark:bg-gray-900 sticky top-0 z-10`}>
                    {!isCollapsed && (
                        <div className="flex items-center px-2">
                            <Link href="/">
                                <Image
                                    src="/image/logo.png"
                                    alt="Stackup Logo"
                                    width={100}
                                    height={28}
                                    className="object-contain transition-all"
                                />
                            </Link>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-[#DC5178] transition-all mx-auto"
                    >
                        {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Admin Profile - Avatar */}
                <div className={`flex flex-col items-center justify-center py-6 border-b border-gray-50 dark:border-gray-800 transition-all duration-300 ${isCollapsed ? "px-2" : "px-4"}`}>
                    <Avatar className={`${isCollapsed ? "w-10 h-10" : "w-16 h-16"} mb-2 transition-all duration-300 border-2 border-white dark:border-gray-800 shadow-lg shadow-pink-500/10`}>
                        <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                        <AvatarFallback className="flex items-center justify-center bg-pink-50 dark:bg-pink-900/20 text-[#DC5178] text-xl font-bold font-lexend w-full h-full">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                        </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                        <div className="text-center animate-in fade-in duration-500">
                            <h3 className="text-gray-900 dark:text-white font-bold font-lexend text-[15px] truncate max-w-[180px]">
                                {user?.name || "Admin"}
                            </h3>
                            <p className="text-gray-400 dark:text-gray-400 font-jost text-[12px] font-medium capitalize">
                                {user?.role || "Administrator"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-lexend text-[14px] relative group ${isActive
                                    ? "bg-pink-50 dark:bg-pink-900/10 text-[#DC5178] border border-pink-100/50 dark:border-pink-900/30"
                                    : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                    } ${isCollapsed ? "justify-center" : ""}`}
                            >
                                <div className="relative">
                                    <Icon size={18} className={`shrink-0 ${isActive ? "text-[#DC5178]" : ""}`} />
                                    {isCollapsed && link.name === "Course Requests" && pendingCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#DC5178] rounded-full border border-white dark:border-gray-900 animate-pulse" />
                                    )}
                                </div>
                                {!isCollapsed && <span className="font-semibold">{link.name}</span>}

                                {/* Pending Requests Badge */}
                                {!isCollapsed && link.name === "Course Requests" && pendingCount > 0 && (
                                    <span className="ml-auto bg-[#DC5178] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] flex items-center justify-center animate-pulse">
                                        {pendingCount}
                                    </span>
                                )}

                                {/* Tooltip for collapsed state (with count if applicable) */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap shadow-xl flex items-center gap-2">
                                        {link.name}
                                        {link.name === "Course Requests" && pendingCount > 0 && (
                                            <span className="bg-[#DC5178] px-1.5 rounded-full text-[10px] font-black">
                                                {pendingCount}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-gray-50 dark:border-gray-800 space-y-2">
                    {mounted ? (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all font-lexend text-[14px] group relative ${isCollapsed ? "justify-center" : ""}`}
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                            {!isCollapsed && <span className="font-semibold">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}

                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap shadow-xl">
                                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                                </div>
                            )}
                        </button>
                    ) : (
                        <div className="w-full h-[45px] bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />
                    )}

                    <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-all font-lexend text-[14px] disabled:opacity-50 group relative ${isCollapsed ? "justify-center" : ""}`}
                    >
                        {isLoading ? (
                            <BiLoaderAlt className="animate-spin" size={18} />
                        ) : (
                            <MdLogout size={18} />
                        )}
                        {!isCollapsed && <span className="font-semibold truncate">{isLoading ? 'Logging out...' : 'Logout'}</span>}

                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap shadow-xl">
                                Logout
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
