import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MobileNav from './MobileNav'

const Navbar = () => {
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


            {/* Mobile Menu Button & Overlay */}
            <MobileNav />
        </nav>
    )
}

export default Navbar