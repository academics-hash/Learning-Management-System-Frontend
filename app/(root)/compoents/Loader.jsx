"use client";
import React from 'react';
import Image from 'next/image';
import { BiLoaderAlt } from 'react-icons/bi';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm gap-4">
            <div className="relative flex flex-col items-center gap-6">
                <div className="relative w-40 h-12">
                    <Image
                        src="/image/logo.png"
                        alt="Stackup Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <BiLoaderAlt className="animate-spin text-4xl text-[#DC5178]" />
                    <span className="text-white/60 font-jost text-sm uppercase tracking-widest animate-pulse">
                        Loading Experience
                    </span>
                </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute w-[400px] h-[400px] bg-[#DC5178] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
        </div>
    );
};

export default Loader;
