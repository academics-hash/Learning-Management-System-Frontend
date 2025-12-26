"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, HelpCircle, MapPin, GraduationCap, Briefcase, Users, Clock, Award } from 'lucide-react';
import gsap from 'gsap';

const faqData = [
    {
        category: "About Us",
        icon: MapPin,
        questions: [
            {
                question: "Where is StackUp Learning Hub located?",
                answer: "StackUp Learning Hub is strategically situated in the heart of Kerala's premier IT hub – Technopark Phase 1, Trivandrum. Our state-of-the-art training facility is located in the Asiatic Business Centre, Kazhakuttam. Being in Technopark gives our students direct exposure to the vibrant tech ecosystem and networking opportunities with leading IT companies.",
            },
            {
                question: "Why is StackUp considered the best software company for learning?",
                answer: "As a software company operating from Technopark Phase 1, we bring real-world industry experience directly into our curriculum. Our instructors are working professionals, our projects mirror actual industry requirements, and our placement network includes top IT companies from the park. We're not just a training institute – we're a software company that trains, giving you unparalleled practical exposure.",
            },
        ]
    },
    {
        category: "Courses & Programs",
        icon: GraduationCap,
        questions: [
            {
                question: "What kind of online courses do you offer?",
                answer: "We offer comprehensive, industry-aligned programs including MERN Stack Development, Python Full Stack, Artificial Intelligence & Machine Learning (AI/ML), Data Science, Data Analytics, Digital Marketing, Software Testing (Manual & Automation), UI/UX Design, and Flutter Mobile Development. Each course is designed based on current industry demands and taught by expert practitioners.",
            },
            {
                question: "Are your courses suitable for beginners?",
                answer: "Absolutely! Our courses are designed for all skill levels. We offer beginner-friendly batches that start from fundamentals, as well as advanced programs for experienced developers looking to upskill. Our personalized learning approach ensures everyone progresses at their own pace.",
            },
            {
                question: "What is the duration of your courses?",
                answer: "Course durations vary based on the program. Our intensive bootcamps range from 3-6 months, while comprehensive programs can extend to 8-12 months. All courses include hands-on projects, assessments, and real-world capstone projects to ensure job-readiness.",
            },
        ]
    },
    {
        category: "Placements & Career",
        icon: Briefcase,
        questions: [
            {
                question: "Do you provide placement assistance?",
                answer: "Yes! We provide 100% placement assistance to all our students. Being a software company ourselves located in Technopark Phase 1, we have strong ties with major IT companies. Our dedicated placement cell conducts mock interviews, resume workshops, and connects students directly with hiring partners. Many of our top performers get hired within our own organization.",
            },
            {
                question: "What is your placement track record?",
                answer: "We're proud of our strong placement record with students placed in top companies across India. Our alumni work at leading tech companies, startups, and MNCs. We focus not just on getting you a job, but on building a sustainable career in tech with competitive salaries.",
            },
        ]
    },
    {
        category: "Admission & Support",
        icon: Users,
        questions: [
            {
                question: "How can I enroll in a course?",
                answer: "Enrolling is simple! You can explore our Programs page, select your preferred course, and click 'Enroll Now'. Alternatively, visit our training center at Technopark Phase 1, or contact our admission counselors at +91 62388 72311 for personalized guidance. We also offer free career counseling sessions.",
            },
            {
                question: "Do you offer internships?",
                answer: "Yes, we offer paid and project-based internship opportunities for students and fresh graduates. Our internships provide real-world exposure to software development processes within a functioning software company environment, making you industry-ready before graduation.",
            },
            {
                question: "What support do you provide during the course?",
                answer: "We believe in comprehensive student support. You'll have access to dedicated mentors, doubt-clearing sessions, 24/7 lab access, online learning materials, peer study groups, and career guidance. Our small batch sizes ensure personalized attention for every student.",
            },
        ]
    },
];

const FAQPage = () => {
    const heroRef = useRef(null);
    const categoriesRef = useRef([]);
    const ctaRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            // Hero animation - simple fade in
            gsap.fromTo(heroRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );

            // Categories stagger animation
            gsap.fromTo(categoriesRef.current,
                { opacity: 0, y: 15 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                    delay: 0.2
                }
            );

            // CTA card animation
            gsap.fromTo(ctaRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.4 }
            );

            // Bottom cards animation
            gsap.fromTo(cardsRef.current,
                { opacity: 0, y: 15 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.08,
                    ease: 'power2.out',
                    delay: 0.5
                }
            );
        });

        return () => ctx.revert();
    }, []);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqData.flatMap(category =>
            category.questions.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer,
                },
            }))
        ),
    };

    return (
        <div className="min-h-screen bg-white font-jost mt-8 rounded-2xl">
            {/* Schema.org JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Main Container */}
            <div className="mx-auto max-w-6xl">

                {/* Hero Section */}
                <div ref={heroRef} className="px-6 md:px-12 py-12 md:py-16">
                    <div className="max-w-3xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 mb-6">
                            <HelpCircle size={14} className="text-[#DC5178]" />
                            <span className="text-xs font-semibold text-[#DC5178] uppercase tracking-wider font-lexend">Support Center</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-lexend mb-4 leading-tight">
                            Frequently Asked <span className="text-[#DC5178]">Questions</span>
                        </h1>
                        <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl">
                            Everything you need to know about StackUp Learning Hub, the best software company in Technopark Phase 1. Can&apos;t find your answer? Contact our team.
                        </p>
                    </div>
                </div>

                {/* FAQ Content */}
                <div className="px-6 md:px-12 py-10">
                    <div className="space-y-10">
                        {faqData.map((category, catIndex) => (
                            <div
                                key={catIndex}
                                ref={el => categoriesRef.current[catIndex] = el}
                            >
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-pink-50 rounded-xl border border-pink-100">
                                        <category.icon size={18} className="text-[#DC5178]" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 font-lexend">{category.category}</h2>
                                </div>

                                {/* Questions */}
                                <div className="space-y-3 pl-2">
                                    {category.questions.map((faq, qIndex) => (
                                        <FaqItem key={qIndex} question={faq.question} answer={faq.answer} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Call to Action Card */}
                    <div
                        ref={ctaRef}
                        className="mt-14 bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden group hover:border-pink-100 hover:shadow-md transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-pink-50/30 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 font-lexend mb-2">Still have questions?</h3>
                                <p className="text-gray-500 text-sm max-w-md">
                                    Can&apos;t find what you&apos;re looking for? Our team at Technopark Phase 1 is ready to help you with personalized guidance.
                                </p>
                            </div>
                            <a
                                href="https://wa.me/916238872311?text=Hai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-[#DC5178] hover:bg-[#c03e62] rounded-lg shadow-sm shadow-pink-200 transition-all duration-200 font-lexend whitespace-nowrap"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>

                    {/* SEO Rich Content Section */}
                    <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                            ref={el => cardsRef.current[0] = el}
                            className="bg-white border border-gray-100 rounded-xl p-5 hover:border-pink-100 hover:shadow-sm transition-all duration-300"
                        >
                            <div className="p-2 bg-emerald-50 rounded-lg w-fit mb-3">
                                <Award size={18} className="text-emerald-600" />
                            </div>
                            <h4 className="font-bold text-gray-900 font-lexend mb-1">Best Online Courses</h4>
                            <p className="text-gray-500 text-sm">Industry-aligned curriculum designed by working professionals from Technopark.</p>
                        </div>
                        <div
                            ref={el => cardsRef.current[1] = el}
                            className="bg-white border border-gray-100 rounded-xl p-5 hover:border-pink-100 hover:shadow-sm transition-all duration-300"
                        >
                            <div className="p-2 bg-indigo-50 rounded-lg w-fit mb-3">
                                <MapPin size={18} className="text-indigo-600" />
                            </div>
                            <h4 className="font-bold text-gray-900 font-lexend mb-1">Technopark Phase 1</h4>
                            <p className="text-gray-500 text-sm">Located in Kerala&apos;s largest IT hub with access to 500+ IT companies.</p>
                        </div>
                        <div
                            ref={el => cardsRef.current[2] = el}
                            className="bg-white border border-gray-100 rounded-xl p-5 hover:border-pink-100 hover:shadow-sm transition-all duration-300"
                        >
                            <div className="p-2 bg-amber-50 rounded-lg w-fit mb-3">
                                <Briefcase size={18} className="text-amber-600" />
                            </div>
                            <h4 className="font-bold text-gray-900 font-lexend mb-1">100% Placement Support</h4>
                            <p className="text-gray-500 text-sm">Dedicated placement cell with direct connections to top hiring companies.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-pink-100 shadow-sm' : 'border-gray-100 hover:border-gray-200'
                }`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
            >
                <span className={`font-medium transition-colors text-sm md:text-base ${isOpen ? 'text-[#DC5178]' : 'text-gray-800 group-hover:text-[#DC5178]'
                    }`}>
                    {question}
                </span>
                <span className={`ml-4 shrink-0 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${isOpen ? 'bg-pink-50 text-[#DC5178] rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-pink-50 group-hover:text-[#DC5178]'
                    }`}>
                    <ChevronDown size={16} />
                </span>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-4">
                    {answer}
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
