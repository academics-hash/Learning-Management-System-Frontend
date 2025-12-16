'use client'
import React from 'react'

const ScrollToTop = () => {
    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-[#2E0215] w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
            aria-label="Scroll to top"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </button>
    )
}

export default ScrollToTop
