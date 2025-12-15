'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

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
                <Link href="/course" className="text-white/90 hover:text-white text-[16px] font-normal leading-[100%] tracking-[0%] transition-colors" style={{ fontFamily: 'Switzer, sans-serif' }}>
                    Courses
                </Link>
            </div>

            {/* Desktop Connect Button */}
            <div className="ml-auto hidden md:block">
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
</div>


            {/* Mobile Menu Button */}
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
            </div>

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
                        href="/course"
                        onClick={() => setIsOpen(false)}
                        className="text-white text-lg font-medium hover:text-[#DC5178] transition-colors"
                        style={{ fontFamily: 'Switzer, sans-serif' }}
                    >
                        Courses
                    </Link>
                    <Link
                        href="/contact"
                        onClick={() => setIsOpen(false)}
                        className="bg-[#DC5178] hover:bg-[#c03e63] text-white px-6 py-2.5 rounded-full font-medium text-base transition-all shadow-[0_0_15px_rgba(220,81,120,0.4)]"
                        style={{ fontFamily: 'Switzer, sans-serif' }}
                    >
                        Contact Us
                    </Link>
                </div>
            )}
        </nav>
    )
}

export default Navbar