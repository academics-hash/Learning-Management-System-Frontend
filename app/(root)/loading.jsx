"use client";
import React from 'react';
import Image from 'next/image';
import { BiLoaderAlt } from 'react-icons/bi';

const Loading = () => {
    return (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm gap-4">
            <div className="relative">
                <Image
                    src="/image/logo.png"
                    alt="Stackup Logo"
                    width={180}
                    height={50}
                    className="object-contain"
                    priority
                />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <BiLoaderAlt className="animate-spin text-3xl text-[#DC5178]" />
                </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute w-[300px] h-[300px] bg-[#DC5178] rounded-full blur-[100px] opacity-10 animate-pulse"></div>
        </div>
    );
};

export default Loading;
