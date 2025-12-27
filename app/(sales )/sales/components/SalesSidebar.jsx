"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Users, ChevronLeft, Sun, Moon, Menu, Mail } from 'lucide-react';
import { useTheme } from "next-themes";
import { useState, useEffect } from 'react';
import { useLogoutUserMutation } from '@/feature/api/authApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BiLoaderAlt } from 'react-icons/bi';
import { MdLogout } from "react-icons/md";
import Image from "next/image";

const SalesSidebar = ({ isCollapsed, setIsCollapsed }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [logoutUser, { isLoading }] = useLogoutUserMutation();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            toast.success("Logged out successfully");
            router.push('/login');
        } catch (error) {
            console.error("Logout failed", error);
            toast.error("Failed to log out");
        }
    };

    const links = [
        { name: "Dashboard", href: "/sales", icon: LayoutDashboard },
        { name: "Users", href: "/sales/users", icon: Users },
        { name: "Enquiries", href: "/sales/enquiries", icon: MessageSquare },
        { name: "Contact Details", href: "/sales/contacts", icon: Mail },
    ];

    return (
        <div
            className={`bg-white h-full border-r border-gray-100 flex flex-col overflow-y-auto transition-all duration-300 shadow-sm ${isCollapsed ? "w-[80px]" : "w-full"
                }`}
        >
            {/* Logo & Toggle */}
            <div className={`h-16 flex items-center border-b border-gray-50 px-4 justify-between bg-white sticky top-0 z-10`}>
                {!isCollapsed && (
                    <div className="flex items-center px-2">
                        <Image
                            src="/image/logo.png"
                            alt="Stackup Logo"
                            width={100}
                            height={28}
                            className="object-contain"
                        />
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-[#DC5178] transition-all mx-auto"
                >
                    {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Sales Profile - Avatar */}
            <div className={`flex flex-col items-center justify-center py-6 border-b border-gray-50 transition-all duration-300 overflow-hidden ${isCollapsed ? "px-2" : "px-4"}`}>
                <Avatar className={`${isCollapsed ? "w-10 h-10" : "w-16 h-16"} mb-2 transition-all duration-300 ring-2 ring-gray-50 ring-offset-2`}>
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-gray-300 text-[#DC5178] font-bold font-lexend border border-gray-100">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
                    </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                    <div className="text-center animate-in fade-in duration-500">
                        <h3 className="text-gray-900 font-bold font-lexend text-[15px] truncate max-w-[180px]">
                            {user?.name || "Sales Executive"}
                        </h3>
                        <p className="text-gray-400 font-jost text-[12px] font-medium capitalize">
                            {user?.role || "Sales"}
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
                                ? "bg-pink-50 text-[#DC5178] border border-pink-100/50"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                } ${isCollapsed ? "justify-center" : ""}`}
                        >
                            <Icon size={18} className={`shrink-0 ${isActive ? "text-[#DC5178]" : ""}`} />
                            {!isCollapsed && <span className="font-semibold">{link.name}</span>}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap shadow-xl">
                                    {link.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-50 space-y-2">
                {mounted ? (
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all font-lexend text-[14px] group relative ${isCollapsed ? "justify-center" : ""}`}
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        {!isCollapsed && <span className="font-semibold">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}

                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap shadow-xl">
                                {theme === "dark" ? "Light Mode" : "Dark Mode"}
                            </div>
                        )}
                    </button>
                ) : (
                    <div className="w-full h-[45px] bg-gray-50 rounded-xl animate-pulse" />
                )}

                <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all font-lexend text-[14px] disabled:opacity-50 group relative ${isCollapsed ? "justify-center" : ""}`}
                >
                    {isLoading ? (
                        <BiLoaderAlt className="animate-spin" size={18} />
                    ) : (
                        <MdLogout size={18} />
                    )}
                    {!isCollapsed && <span className="font-semibold truncate">{isLoading ? 'Logging out...' : 'Logout'}</span>}

                    {isCollapsed && (
                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap shadow-xl">
                            Logout
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SalesSidebar;
