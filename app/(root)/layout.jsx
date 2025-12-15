import React from 'react'
import Navbar from './compoents/Navbar'
import Footer from './compoents/Footer'

const HomeLayout = ({ children }) => {
    return (
        <div className="relative min-h-screen flex flex-col mt-5 px-12">
            <Navbar />
            <main className="grow">
                {children}
            </main>
            
            <Footer />
        </div>
    )
}

export default HomeLayout