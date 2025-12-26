"use client";

import { useLayoutEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

/**
 * SmoothScroller Component - Optimized for All Devices
 * 
 * PERFORMANCE FEATURES:
 * ✅ Device Detection: Automatically detects mobile, tablet, and desktop devices
 * ✅ Adaptive Settings: Adjusts animation complexity based on device capabilities
 * ✅ Memory Detection: Reduces effects on low-memory devices (< 4GB RAM)
 * ✅ Reduced Motion Support: Respects user's accessibility preferences
 * ✅ Will-Change Optimization: Adds CSS hints for better GPU acceleration
 * ✅ Conditional Effects: Disables heavy effects (pinning, parallax, blur) on mobile
 * ✅ Faster Animations: Shorter durations and less movement on low-power devices
 * ✅ No Lag: Optimized for smooth 60fps scrolling on all devices
 * 
 * DEVICE-SPECIFIC OPTIMIZATIONS:
 * - Mobile/Tablet: Faster scroll duration (0.8s vs 1.2s), no pinning, no parallax, no blur
 * - Desktop: Full effects enabled with smooth animations
 * - Low Memory: Disables blur and heavy effects regardless of device type
 * - Reduced Motion: Disables all animations if user prefers reduced motion
 */

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroller() {
    const pathname = usePathname();

    useLayoutEffect(() => {
        // ===== PERFORMANCE OPTIMIZATION: Device Detection =====
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
        const isLowPowerDevice = isMobile || isTablet;

        // Check if user prefers reduced motion (accessibility)
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Detect device memory (if available) - Chrome only
        const deviceMemory = navigator.deviceMemory || 4; // Default to 4GB if not available
        const isLowMemoryDevice = deviceMemory < 4;

        // ===== ADAPTIVE SETTINGS BASED ON DEVICE =====
        const performanceConfig = {
            // Smooth scrolling settings
            lenisSettings: {
                duration: isLowPowerDevice ? 0.8 : 1.2, // Faster on mobile
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: "vertical",
                gestureDirection: "vertical",
                smooth: !prefersReducedMotion, // Disable if user prefers reduced motion
                mouseMultiplier: isLowPowerDevice ? 0.7 : 1,
                smoothTouch: false, // Always false for better mobile performance
                touchMultiplier: isLowPowerDevice ? 1.5 : 2,
                infinite: false,
            },
            // Animation settings
            animations: {
                enabled: !prefersReducedMotion,
                enableHeavyEffects: !isLowPowerDevice && !isLowMemoryDevice, // Disable heavy effects on low-power devices
                scrubSmoothing: isLowPowerDevice ? 0.5 : 1, // Less smooth scrubbing on mobile for performance
                enablePinning: !isLowPowerDevice, // Disable pinning on mobile devices
                enableParallax: !isLowPowerDevice, // Disable parallax on mobile
                enableBlur: !isLowPowerDevice && !isLowMemoryDevice, // Blur is expensive
            }
        };

        // 1. Initialize Lenis for smooth scrolling with adaptive settings
        const lenis = new Lenis(performanceConfig.lenisSettings);

        // 2. Sync Lenis with GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        // 3. Integrate with GSAP Ticker (optimized)
        const tickerFn = (time) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerFn);

        // Lag smoothing: 0 for consistent frame timing
        gsap.ticker.lagSmoothing(0);


        // 4. Global Animation Context with Performance Optimization
        const ctx = gsap.context(() => {

            // Skip animations if user prefers reduced motion
            if (!performanceConfig.animations.enabled) {
                return;
            }

            // --- 1. Cinematic Product Reveal (Pinned) ---
            // Only on desktop/high-power devices
            if (performanceConfig.animations.enablePinning && performanceConfig.animations.enableHeavyEffects) {
                const cinematicReveals = document.querySelectorAll('[data-effect="cinematic-reveal"]');
                cinematicReveals.forEach((target) => {
                    // Add will-change for better performance
                    target.style.willChange = 'transform, opacity';

                    const animation = performanceConfig.animations.enableBlur
                        ? { scale: 0.8, opacity: 0, filter: "brightness(0.5)" }
                        : { scale: 0.8, opacity: 0 }; // Skip blur on low-power devices

                    const animationTo = performanceConfig.animations.enableBlur
                        ? { scale: 1, opacity: 1, filter: "brightness(1)", ease: "power2.out" }
                        : { scale: 1, opacity: 1, ease: "power2.out" };

                    gsap.fromTo(target, animation, {
                        ...animationTo,
                        scrollTrigger: {
                            trigger: target,
                            start: "center center",
                            end: "+=50%",
                            pin: true,
                            scrub: performanceConfig.animations.scrubSmoothing,
                            onComplete: () => { target.style.willChange = 'auto'; }
                        }
                    });
                });
            }

            // --- 2. Vertical Parallax Stack ---
            // Only on desktop devices
            if (performanceConfig.animations.enableParallax) {
                const stackContainers = document.querySelectorAll('[data-parallax-stack]');
                stackContainers.forEach((container) => {
                    const children = container.querySelectorAll('[data-depth]');
                    children.forEach((child) => {
                        child.style.willChange = 'transform';
                        const depth = parseFloat(child.getAttribute('data-depth') || "0.2");
                        gsap.to(child, {
                            y: (i, el) => -depth * 100,
                            ease: "none",
                            scrollTrigger: {
                                trigger: container,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true,
                                onComplete: () => { child.style.willChange = 'auto'; }
                            }
                        });
                    });
                });
            }

            // --- 6. Horizontal Scroll Illusion (Pinned) ---
            // Only on desktop devices
            if (performanceConfig.animations.enablePinning && performanceConfig.animations.enableHeavyEffects) {
                const horizontalSections = document.querySelectorAll('[data-pin="horizontal"]');
                horizontalSections.forEach((section) => {
                    const content = section.querySelector('[data-pin-content]');
                    if (content) {
                        content.style.willChange = 'transform';
                        const getScrollAmount = () => -(content.scrollWidth - window.innerWidth + 100);
                        gsap.to(content, {
                            x: getScrollAmount,
                            ease: "none",
                            scrollTrigger: {
                                trigger: section,
                                start: "center center",
                                end: () => `+=${content.scrollWidth}`,
                                pin: true,
                                scrub: performanceConfig.animations.scrubSmoothing,
                                invalidateOnRefresh: true,
                                onComplete: () => { content.style.willChange = 'auto'; }
                            },
                        });
                    }
                });
            }

            // --- 8. Scroll-Controlled Rotation ---
            // Simplified on mobile
            const rotators = document.querySelectorAll('[data-rotate-scroll]');
            rotators.forEach((target) => {
                target.style.willChange = 'transform';
                gsap.to(target, {
                    rotation: isLowPowerDevice ? 180 : 360, // Less rotation on mobile
                    ease: "none",
                    scrollTrigger: {
                        trigger: target,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: performanceConfig.animations.scrubSmoothing,
                        onComplete: () => { target.style.willChange = 'auto'; }
                    }
                });
            });

            // --- 9. Minimal Feature Fade Up (Standard) ---
            // Lightweight - works on all devices
            const revealTargets = document.querySelectorAll("section:not(.no-animate), .animate-fade-up");
            revealTargets.forEach((target) => {
                gsap.fromTo(
                    target,
                    { autoAlpha: 0, y: isLowPowerDevice ? 30 : 50 }, // Less movement on mobile
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: isLowPowerDevice ? 0.5 : 0.8, // Faster on mobile
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: target,
                            start: "top 85%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });

            // --- 5. Floating UI Parallax (Standard) ---
            // Only on desktop
            if (performanceConfig.animations.enableParallax) {
                const parallaxTargets = document.querySelectorAll("[data-speed]");
                parallaxTargets.forEach((target) => {
                    target.style.willChange = 'transform';
                    const speed = parseFloat(target.getAttribute("data-speed") || "0.5");
                    gsap.to(target, {
                        y: (i, el) => (1 - speed) * 100,
                        ease: "none",
                        scrollTrigger: {
                            trigger: target,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                            onComplete: () => { target.style.willChange = 'auto'; }
                        },
                    });
                });
            }

            // --- NEW: Masterclass Pinned Sequence (Scrollytelling) ---
            // Only on desktop
            if (performanceConfig.animations.enablePinning) {
                const sequences = document.querySelectorAll('[data-pin-sequence]');
                sequences.forEach((section) => {
                    const steps = section.querySelectorAll('[data-step]');
                    if (steps.length === 0) return;

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: () => `+=${steps.length * 100}%`,
                            pin: true,
                            scrub: performanceConfig.animations.scrubSmoothing,
                        }
                    });

                    steps.forEach((step, index) => {
                        const animType = step.getAttribute('data-anim') || "fade";
                        const yOffset = isLowPowerDevice ? 30 : 50;

                        if (index === 0) {
                            tl.fromTo(step, { autoAlpha: 0, y: yOffset }, { autoAlpha: 1, y: 0, duration: 1 }, index);
                        } else {
                            tl.fromTo(step, { autoAlpha: 0, y: yOffset }, { autoAlpha: 1, y: 0, duration: 1 }, index);
                        }
                    });
                });
            }

            // --- NEW: Text Stagger Reveal ---
            // Simplified on mobile
            const staggerTexts = document.querySelectorAll('[data-text-stagger]');
            staggerTexts.forEach((wrapper) => {
                if (wrapper.children.length > 0) {
                    const blurEffect = performanceConfig.animations.enableBlur
                        ? { y: 30, autoAlpha: 0, filter: "blur(5px)" }
                        : { y: 30, autoAlpha: 0 };

                    const blurEffectTo = performanceConfig.animations.enableBlur
                        ? { y: 0, autoAlpha: 1, filter: "blur(0px)" }
                        : { y: 0, autoAlpha: 1 };

                    gsap.fromTo(wrapper.children, blurEffect, {
                        ...blurEffectTo,
                        stagger: isLowPowerDevice ? 0.05 : 0.1, // Faster stagger on mobile
                        duration: isLowPowerDevice ? 0.5 : 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: wrapper,
                            start: "top 85%"
                        }
                    });
                }
            });

        });

        return () => {
            lenis.destroy();
            gsap.ticker.remove(tickerFn);
            ctx.revert();
        };
    }, [pathname]);

    return null;
}
