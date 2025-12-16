import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaInstagram, FaFacebookSquare, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import ScrollToTop from './ScrollToTop'

const Footer = () => {
    return (
        <div>

            <footer className="relative mt-10 w-full border-t border-white/20 bg-footer-bg overflow-hidden rounded-t-[30px] md:rounded-t-[40px] rounded-b-[30px] md:rounded-b-[40px] font-inter">
                <div className="absolute inset-0 pointer-events-none bg-footer-overlay z-0"></div>

                <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-10 z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="space-y-6">
                            <Link href="/" className="block">
                                <Image
                                    src="/image/logo.png"
                                    alt="StackUp Logo"
                                    width={140}
                                    height={40}
                                    className="object-contain"
                                />
                            </Link>
                            <p className="text-gray-300 text-sm leading-relaxed max-w-[300px]">
                                If you are looking for the best course to learn programming, Join Stackup Now!
                            </p>
                        </div>

                        {/* Get Help Column */}
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-6 tracking-wide font-lexend">GET HELP</h3>
                            <ul className="space-y-4">
                                <li><Link href="/contact" className="text-gray-300 hover:text-primary-pink transition-colors text-sm">Contact Us</Link></li>
                                <li><Link href="/articles" className="text-gray-300 hover:text-primary-pink transition-colors text-sm">Latest Articles</Link></li>
                                <li><Link href="/faq" className="text-gray-300 hover:text-primary-pink transition-colors text-sm">FAQ</Link></li>
                            </ul>
                        </div>

                        {/* Programs Column */}
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-6 tracking-wide font-lexend">PROGRAMS</h3>
                            <ul className="space-y-4">
                                <li><Link href="/art-design" className="text-gray-300 hover:text-primary-pink transition-colors text-sm">MERN Stack</Link></li>
                                <li><Link href="/art-design" className="text-gray-300 hover:text-primary-pink transition-colors text-sm">Python Full Stack</Link></li>
                                <li><Link href="/business" className="text-gray-300 hover:text-primary-pink transition-colors text-sm">AI/ML</Link></li>
                                <li><Link href="/languages" className="text-gray-300 hover:text-primary-pink transition-colors text-sm">Data Science</Link></li>
                                <li><Link href="/programming" className="text-gray-300 hover:text-primary-pink transition-colors text-sm">Data Analytics</Link></li>

                                <li><Link href="/programming" className="text-gray-300 hover:text-primary-pink transition-colors text-sm">Digital Marketing</Link></li>
                                <li><Link href="/programming" className="text-gray-300 hover:text-primary-pink transition-colors text-sm">Software Testing</Link></li>
                                <li><Link href="/it-software" className="text-gray-300 hover:text-primary-pink transition-colors text-sm">UI/UX</Link></li>
                                <li><Link href="/programming" className="text-gray-300 hover:text-primary-pink transition-colors text-sm">Flutter</Link></li>
                            </ul>
                        </div>

                        {/* Contact Us Column */}
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-6 tracking-wide font-lexend">CONTACT US</h3>
                            <div className="space-y-4">
                                <div className="text-gray-300 text-sm leading-relaxed">
                                    <p className="font-semibold mb-1">Stackup Learning Hub P(LTD).</p>
                                    <p>Connect Hive,</p>
                                    <p>Tc 98/3633, Asiatic Business Centre</p>
                                    <p>Kazhakuttam,</p>
                                    <p>Trivandrum, 695582</p>
                                </div>
                                <div className="pt-2 space-y-2">
                                    <p className="text-gray-300 text-sm">
                                        Tel: +91 62388 72311
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        Mail: info@stackuplearninghub
                                    </p>
                                </div>

                                {/* Social Icons */}
                                <div className="flex items-center gap-4 pt-4">
                                    <Link href="https://www.facebook.com/StackupLearningHub?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
                                        <FaFacebookSquare className="w-5 h-5 text-white hover:text-gray-300 transition-colors" />
                                    </Link>
                                    <Link href="https://www.linkedin.com/company/stackup-learning/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
                                        <FaLinkedin className="w-5 h-5 text-white hover:text-gray-300 transition-colors" />
                                    </Link>
                                    <Link href="https://www.instagram.com/stackuplearning/?hl=en" target="_blank" rel="noopener noreferrer">
                                        <FaInstagram className="w-5 h-5 text-white hover:text-gray-300 transition-colors" />
                                    </Link>
                                    <Link href="https://wa.me" target="_blank" rel="noopener noreferrer">
                                        <FaWhatsapp className="w-5 h-5 text-white hover:text-gray-300 transition-colors" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 relative">
                        {/* Spacer for centering logic if needed, or just allow left/center alignment */}
                        <div className="hidden md:block w-10"></div>

                        <p className="text-gray-400 text-xs text-center">
                            Copyright © {new Date().getFullYear()} Stackup | All Rights Reserved
                        </p>

                        {/* Scroll to Top Button */}
                        <ScrollToTop />
                    </div>
                </div>
            </footer>

            <br />
            <br />
        </div>

    )
}

const SocialLink = ({ href, icon }) => (
    <a href={href} className="text-white hover:text-primary-pink transition-colors">
        <span className="h-5 w-5 flex items-center justify-center font-bold">{icon}</span>
    </a>
)

export default Footer