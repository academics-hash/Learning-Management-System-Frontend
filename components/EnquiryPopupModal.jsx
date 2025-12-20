"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BiLoaderAlt } from 'react-icons/bi';
import { useSubmitEnquiryMutation } from '@/feature/api/enquiryApi';
import { toast } from 'sonner';
import Image from 'next/image';
import { useSelector } from 'react-redux';

const EnquiryPopupModal = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const hasShownModal = useRef(false);
    const [submitEnquiry, { isLoading }] = useSubmitEnquiryMutation();

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: ''
    });

    // Show modal after 10 seconds if user is not authenticated
    useEffect(() => {
        if (isAuthenticated || hasShownModal.current) {
            return;
        }

        const timer = setTimeout(() => {
            setIsOpen(true);
            hasShownModal.current = true;
        }, 10000); // 10 seconds

        return () => clearTimeout(timer);
    }, [isAuthenticated]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await submitEnquiry(formData).unwrap();
            toast.success(result.message || "Enquiry submitted successfully! We will contact you soon.");

            // Reset form and close modal
            setFormData({ name: '', phoneNumber: '' });
            setIsOpen(false);
        } catch (error) {
            console.error("Enquiry submission failed:", error);
            const errorMsg = error?.data?.message || "Failed to submit enquiry. Please try again.";
            toast.error(errorMsg);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-[500px] bg-linear-to-br from-[#1a1a1a] to-[#2a2a2a] border-[#DC5178]/30">
                <DialogHeader>
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative w-32 h-16">
                            <Image
                                src="/image/logo.png"
                                alt="Stackup Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-2xl text-white">
                        Get in Touch with Us!
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Share your details and we&apos;ll help you get started with the best courses
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-normal font-lexend text-white">
                            Name <span className="text-[#DC5178]">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            minLength={2}
                            maxLength={100}
                            className="w-full h-12 px-4 bg-[#363538] border border-[#363538] rounded-lg focus:outline-none focus:border-[#DC5178] focus:ring-1 focus:ring-[#DC5178] transition-all font-lexend text-sm text-white placeholder:text-[#BCBEC0]"
                        />
                    </div>

                    {/* Phone Number Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-normal font-lexend text-white">
                            Phone Number <span className="text-[#DC5178]">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="9876543210"
                            required
                            pattern="[6-9][0-9]{9}"
                            title="Please enter a valid 10-digit Indian phone number"
                            className="w-full h-12 px-4 bg-[#363538] border border-[#363538] rounded-lg focus:outline-none focus:border-[#DC5178] focus:ring-1 focus:ring-[#DC5178] transition-all font-lexend text-sm text-white placeholder:text-[#BCBEC0]"
                        />
                        <p className="text-xs text-gray-400 font-jost">
                            Enter a valid 10-digit phone number
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 mt-2 bg-linear-to-r from-[#DC5178] to-[#c03e62] text-white rounded-full font-medium font-lexend text-base hover:shadow-lg hover:shadow-[#DC5178]/50 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <BiLoaderAlt className="animate-spin text-xl" />
                        ) : (
                            'Submit Enquiry'
                        )}
                    </button>

                    {/* Privacy Note */}
                    <p className="text-xs text-center text-gray-400 font-jost">
                        We respect your privacy. Your information will be kept confidential.
                    </p>

                    {/* Close Option */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 text-sm hover:text-gray-300 transition-colors font-jost"
                        >
                            Maybe later
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EnquiryPopupModal;
