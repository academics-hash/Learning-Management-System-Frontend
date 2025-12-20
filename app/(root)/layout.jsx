"use client";
import React, { useEffect, useState } from 'react'
import Navbar from './compoents/Navbar'
import Footer from './compoents/Footer'
import AuthPopupModal from '@/components/AuthPopupModal'
import EnquiryPopupModal from '@/components/EnquiryPopupModal'
import { useSelector } from 'react-redux'
import Loader from './compoents/Loader'

const HomeLayout = ({ children }) => {
    const { loading } = useSelector((state) => state.auth);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted || loading) {
        return <Loader />;
    }

    return (
        <div className="relative min-h-screen flex flex-col mt-5 px-12">
            <Navbar />
            <main className="grow">
                {children}
            </main>

            <Footer />
            <AuthPopupModal />
            <EnquiryPopupModal />
        </div>
    )
}

export default HomeLayout;