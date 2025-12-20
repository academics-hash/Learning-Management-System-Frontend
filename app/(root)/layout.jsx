import React from 'react'
import Navbar from './compoents/Navbar'
import Footer from './compoents/Footer'
import AuthPopupModal from '@/components/AuthPopupModal'
import EnquiryPopupModal from '@/components/EnquiryPopupModal'

const HomeLayout = ({ children }) => {
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

export default HomeLayout