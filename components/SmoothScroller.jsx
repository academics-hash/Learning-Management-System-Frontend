"use client";

import { useLayoutEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroller() {
    const pathname = usePathname();

    useLayoutEffect(() => {
        // 1. Initialize Lenis for smooth scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        // 2. Sync Lenis with GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        // 3. Integrate with GSAP Ticker
        const tickerFn = (time) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);

        // 4. Global Animation Context
        const ctx = gsap.context(() => {

            // --- 1. Cinematic Product Reveal (Pinned) ---
            // Usage: <div data-effect="cinematic-reveal"> ... </div>
            const cinematicReveals = document.querySelectorAll('[data-effect="cinematic-reveal"]');
            cinematicReveals.forEach((target) => {
                gsap.fromTo(target,
                    { scale: 0.8, opacity: 0, filter: "brightness(0.5)" },
                    {
                        scale: 1,
                        opacity: 1,
                        filter: "brightness(1)",
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: target,
                            start: "center center",
                            end: "+=50%",
                            pin: true,
                            scrub: 1,
                        }
                    }
                );
            });

            // --- 2. Vertical Parallax Stack ---
            // Usage: <div data-parallax-stack> <div data-depth="0.2">...</div> </div>
            // Children move at different speeds based on depth
            const stackContainers = document.querySelectorAll('[data-parallax-stack]');
            stackContainers.forEach((container) => {
                const children = container.querySelectorAll('[data-depth]');
                children.forEach((child) => {
                    const depth = parseFloat(child.getAttribute('data-depth') || "0.2");
                    gsap.to(child, {
                        y: (i, el) => -depth * 100, // Move up relative to scroll
                        ease: "none",
                        scrollTrigger: {
                            trigger: container,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    });
                });
            });

            // --- 6. Horizontal Scroll Illusion (Pinned) ---
            // Usage: <section data-pin="horizontal"> <div data-pin-content class="flex ..."> ... </div> </section>
            const horizontalSections = document.querySelectorAll('[data-pin="horizontal"]');
            horizontalSections.forEach((section) => {
                const content = section.querySelector('[data-pin-content]');
                if (content) {
                    const getScrollAmount = () => -(content.scrollWidth - window.innerWidth + 100);
                    gsap.to(content, {
                        x: getScrollAmount,
                        ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            start: "center center",
                            end: () => `+=${content.scrollWidth}`,
                            pin: true,
                            scrub: 1,
                            invalidateOnRefresh: true,
                        },
                    });
                }
            });

            // --- 8. Scroll-Controlled Rotation ---
            // Usage: <div data-rotate-scroll> ... </div>
            const rotators = document.querySelectorAll('[data-rotate-scroll]');
            rotators.forEach((target) => {
                gsap.to(target, {
                    rotation: 360,
                    ease: "none",
                    scrollTrigger: {
                        trigger: target,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                    }
                });
            });

            // --- 9. Minimal Feature Fade Up (Standard) ---
            const revealTargets = document.querySelectorAll("section:not(.no-animate), .animate-fade-up");
            revealTargets.forEach((target) => {
                gsap.fromTo(
                    target,
                    { autoAlpha: 0, y: 50 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
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
            const parallaxTargets = document.querySelectorAll("[data-speed]");
            parallaxTargets.forEach((target) => {
                const speed = parseFloat(target.getAttribute("data-speed") || "0.5");
                gsap.to(target, {
                    y: (i, el) => (1 - speed) * 100,
                    ease: "none",
                    scrollTrigger: {
                        trigger: target,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            });

            // --- NEW: Masterclass Pinned Sequence (Scrollytelling) ---
            // Usage: <section data-pin-sequence> <div data-step>1</div> <div data-step>2</div> </section>
            // Parent pins. Children animate in one by one.
            const sequences = document.querySelectorAll('[data-pin-sequence]');
            sequences.forEach((section) => {
                const steps = section.querySelectorAll('[data-step]');
                if (steps.length === 0) return;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: () => `+=${steps.length * 100}%`, // Scroll distance proportional to steps
                        pin: true,
                        scrub: 1,
                    }
                });

                steps.forEach((step, index) => {
                    // Determine animation type based on attribute, default to fade
                    // Optional: data-anim="slide-up"
                    const animType = step.getAttribute('data-anim') || "fade";

                    if (index === 0) {
                        // First one might stay or just be there. Usually we want transitions.
                        // A simple approach: Fade IN each step in sequence.
                        tl.fromTo(step, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1 }, index);
                    } else {
                        // Subsequent steps: Fade OUT previous, Fade IN current? Or just Stack?
                        // "Pinned panels reveal new content" -> Stack or Crossfade.
                        // Let's go with Stacking/Overlapping (Parallax-ish) or Card Reveal
                        // Simpler: Fade In over the top.
                        tl.fromTo(step, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1 }, index);
                        // If we want previous to fade out:
                        // tl.to(steps[index-1], { autoAlpha: 0, duration: 0.5 }, index - 0.5); 
                    }
                });
            });

            // --- NEW: Text Stagger Reveal ---
            // Usage: <h1 data-text-stagger>...</h1>
            // Splits text into chars/words and staggers them. (Requires SplitText or manual span wrapping - we'll do simple GSAP autoAlpha if standard, 
            // but without Paid Plugins, we strictly can't use SplitText. 
            // We will assume simpler "stagger children" approach if user manually wraps words in spans, OR just simple staggered fade up.)
            const staggerTexts = document.querySelectorAll('[data-text-stagger]');
            staggerTexts.forEach((wrapper) => {
                // We'll animate direct children elements (spans, divs) if they exist
                // If text is plain node, we can't split it easily without plugin.
                // Assumption: User wraps words/lines in spans or divs.
                if (wrapper.children.length > 0) {
                    gsap.fromTo(wrapper.children,
                        { y: 30, autoAlpha: 0, filter: "blur(5px)" },
                        {
                            y: 0,
                            autoAlpha: 1,
                            filter: "blur(0px)",
                            stagger: 0.1,
                            duration: 0.8,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: wrapper,
                                start: "top 85%"
                            }
                        }
                    );
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
