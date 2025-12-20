"use client";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { BiLoaderAlt } from 'react-icons/bi';
import Image from 'next/image';
import SalesSidebar from './components/SalesSidebar';
import { Menu, X } from 'lucide-react';

const SalesLayout = ({ children }) => {
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);

        if (!loading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else {
                const role = user?.role;
                if (role !== 'admin' && role !== 'superadmin' && role !== 'sales') {
                    router.push('/');
                }
            }
        }
        return () => clearTimeout(timer);
    }, [isAuthenticated, user, router, loading]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1200 && window.innerWidth >= 768) {
                setIsCollapsed(true);
            } else if (window.innerWidth >= 1200) {
                setIsCollapsed(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!mounted || loading || !isAuthenticated || (user?.role !== 'admin' && user?.role !== 'superadmin' && user?.role !== 'sales')) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
                <Image
                    src="/image/logo.png"
                    alt="Stackup Logo"
                    width={150}
                    height={40}
                    className="object-contain"
                />
                <BiLoaderAlt className="animate-spin text-2xl text-[#DC5178]" />
            </div>
        );
    }

    return (
        <div className="flex bg-[#F9FAFB] min-h-screen relative overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-110">
                <Image
                    src="/image/logo.png"
                    alt="Stackup Logo"
                    width={100}
                    height={28}
                    className="object-contain"
                />
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-all"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-90"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Desktop: Collapsible, Mobile: Drawer */}
            <div className={`
        fixed inset-y-0 left-0 z-100 transition-all duration-300 transform
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        w-[280px] ${isCollapsed ? "md:w-[80px]" : "md:w-[250px]"}
      `}>
                <SalesSidebar
                    isCollapsed={isCollapsed}
                    setIsCollapsed={(val) => {
                        setIsCollapsed(val);
                        if (window.innerWidth < 768) setIsMobileMenuOpen(false);
                    }}
                />
            </div>

            {/* Main Content Area */}
            <div className={`
        flex-1 transition-all duration-300 overflow-y-auto h-screen
        mt-16 md:mt-0
        ${isCollapsed ? "md:ml-[80px]" : "md:ml-[250px]"}
        p-4 md:p-8 lg:p-10
      `}>
                <div className="max-w-[1600px] mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SalesLayout;
