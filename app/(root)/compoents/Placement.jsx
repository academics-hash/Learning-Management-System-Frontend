"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Play, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

import { useGetAllPlacementsQuery } from '@/feature/api/placementApi';

const Placement = () => {
  const { data, isLoading } = useGetAllPlacementsQuery();
  const placementData = data?.placements || [];
  const [selectedVideo, setSelectedVideo] = useState(null);
  const containerRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  const tweenRef = React.useRef(null);

  useGSAP(() => {
    if (!scrollRef.current || !containerRef.current || placementData.length === 0) return;

    // Only animate if we have enough data to actually need scrolling (e.g., more than 3)
    if (placementData.length > 3) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const totalWidth = scrollWidth / 2;

      tweenRef.current = gsap.to(scrollRef.current, {
        x: -totalWidth,
        duration: 20,
        ease: "none",
        repeat: -1,
        paused: false
      });
    }

    // Entrance animation for the section
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 50,
      duration: 1.5,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      }
    });
  }, { scope: containerRef, dependencies: [isLoading, placementData.length] });

  const handleMouseEnter = () => {
    if (tweenRef.current) tweenRef.current.pause();
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) tweenRef.current.play();
  };

  // Only duplicate if we have enough items for a carousel, otherwise just show the real data
  const loopedData = placementData.length > 3 ? [...placementData, ...placementData] : placementData;

  if (isLoading || placementData.length === 0) return null;

  return (
    <section ref={containerRef} className="py-16 bg-[#050505] relative overflow-hidden rounded-[40px] md:rounded-[80px] mx-4 md:mx-8 border border-white/10">
      {/* --- Futuristic Background Layers --- */}

      {/* 1. Digital Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.15]"
        style={{ backgroundImage: `linear-gradient(#DC5178 1px, transparent 1px), linear-gradient(90deg, #DC5178 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>

      {/* 2. Radial Vignette for Depth */}
      <div className="absolute inset-0 bg-radial-gradient(circle at 50% 50%, transparent 0%, #050505 80%) shadow-[inset_0_0_100px_rgba(0,0,0,1)]"></div>

      {/* 3. Animated Floating Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary-pink/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full animate-bounce animation-duration-[10s]"></div>
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-primary-pink/5 blur-[100px] rounded-full"></div>

      <div className="px-6 md:px-12 max-w-[1600px] mx-auto mb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-pink/10 border border-primary-pink/20">
              <span className="w-2 h-2 rounded-full bg-primary-pink animate-ping"></span>
              <span className="text-primary-pink text-xs font-bold tracking-widest uppercase font-lexend">Live Placements</span>
            </div>
            <h2 className="text-[36px] md:text-[52px] font-bold text-white font-lexend leading-tight">
              Future-Ready <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-pink to-purple-500">Success Stories</span>
            </h2>
          </div>
          <p className="text-white/50 font-jost text-lg max-w-md border-l-2 border-primary-pink/30 pl-6">
            Bridging the gap between learning and industry. Our graduates are now driving innovation at top tech firms globally.
          </p>
        </div>
      </div>

      {/* --- Infinite Carousel with Futuristic Cards --- */}
      <div
        className="flex items-center relative z-10 py-6"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Side Fades - Only show if we are actually scrolling (more than 3 items) */}
        {placementData.length > 3 && (
          <>
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-[#050505] to-transparent z-20"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-[#050505] to-transparent z-20"></div>
          </>
        )}

        <div
          ref={scrollRef}
          className={`flex gap-8 px-8 ${placementData.length <= 3 ? "justify-center w-full" : ""}`}
        >
          {loopedData.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="placement-card shrink-0 w-[280px] md:w-[320px] group relative h-[400px] rounded-[32px] overflow-hidden cursor-pointer bg-[#0A0A0A] border border-white/5 shadow-2xl transition-all duration-700 hover:scale-[1.03]"
              onClick={() => setSelectedVideo(item.video_url)}
            >
              {/* Card Glow Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(220,81,120,0.15) 0%, transparent 70%)"></div>

              {/* Student Image with Futuristic Mask/Treatment */}
              <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                <Image
                  src={item.student_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=387&auto=format&fit=crop"}
                  alt={item.student_name}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                />
              </div>

              {/* Scanned Line Animation (Tech Detail) */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary-pink/50 to-transparent -translate-y-full group-hover:animate-[scan_3s_infinite] z-20 opacity-0 group-hover:opacity-100"></div>

              {/* Digital Overlay UI */}
              <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent z-10"></div>

              {/* Play Button - Tech Style */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-20 h-20 rounded-full flex items-center justify-center relative overflow-hidden group/btn" onClick={(e) => { e.stopPropagation(); setSelectedVideo(item.video_url); }}>
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/20 group-hover/btn:bg-primary-pink transition-all duration-500 scale-90 group-hover/btn:scale-100"></div>
                  {/* Rotating Border */}
                  <div className="absolute inset-0 border-2 border-dashed border-primary-pink/30 rounded-full animate-[spin_8s_linear_infinite] group-hover/btn:border-white/50"></div>
                  <Play className="text-white fill-white w-6 h-6 ml-1 relative z-10 transition-transform group-hover/btn:scale-110" />
                </div>
              </div>

              {/* Content Info - Tech Typography */}
              <div className="absolute bottom-10 left-10 right-10 z-30">
                <div className="space-y-1">
                  <h3 className="text-white text-2xl font-bold font-lexend tracking-tight group-hover:text-primary-pink transition-colors">
                    {item.student_name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-pink rounded-full"></div>
                    <p className="text-white/50 text-xs font-lexend uppercase tracking-[0.2em]">
                      {item.designation}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] text-white/30 font-lexend uppercase tracking-widest">Global Placement</span>
                  <div className="px-4 py-1.5 bg-primary-pink/10 backdrop-blur-md rounded-lg border border-primary-pink/30 group-hover:bg-primary-pink/20 transition-all">
                    <span className="text-primary-pink text-sm font-bold font-lexend tracking-tighter">
                      {item.lpa}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal - Enhanced UI */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10 backdrop-blur-2xl bg-black/90 animate-in fade-in duration-500 cursor-pointer"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedVideo(null);
            }}
            className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-primary-pink hover:text-white rounded-full text-white/50 transition-all border border-white/10 z-50"
          >
            <X size={24} />
          </button>

          <div
            className="w-full max-w-6xl aspect-video rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(220,81,120,0.3)] border border-primary-pink/30 bg-black relative group/modal cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-primary-pink/5 animate-pulse -z-10"></div>
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(500px); opacity: 0; }
                }
            `}</style>
    </section>
  );
};

export default Placement;
