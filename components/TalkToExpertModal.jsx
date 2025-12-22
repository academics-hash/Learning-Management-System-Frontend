"use client";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BiLoaderAlt } from 'react-icons/bi';
import { useSubmitEnquiryMutation } from '@/feature/api/enquiryApi';
import { toast } from 'sonner';
import Image from 'next/image';

const TalkToExpertModal = ({ isOpen, setIsOpen }) => {
    const [submitEnquiry, { isLoading }] = useSubmitEnquiryMutation();
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitEnquiry(formData).unwrap();
            toast.success("Enquiry submitted! Our team will contact you soon.");
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
            <DialogContent className="max-w-[450px] bg-[#1a1a1a] border-[#DC5178]/30 p-0 overflow-hidden">
                <div className="relative p-8">
                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#DC5178]/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                    <DialogHeader className="relative z-10 mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="relative w-28 h-10">
                                <Image
                                    src="/image/logo.png"
                                    alt="Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <DialogTitle className="text-center text-2xl font-lexend font-bold text-white mb-2">
                            Talk to our <span className="text-[#DC5178]">Experts</span>
                        </DialogTitle>
                        <DialogDescription className="text-center text-gray-400 font-jost">
                            Share your details and we&apos;ll help you chart your path to a successful tech career.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                        <div className="space-y-2">
                            <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#DC5178]/50 focus:bg-white/10 transition-all font-jost"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="91-XXXXX-XXXXX"
                                required
                                pattern="[0-9]{10,12}"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-[#DC5178]/50 focus:bg-white/10 transition-all font-jost"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#DC5178] hover:bg-[#c03e62] text-white font-bold font-lexend py-4 rounded-2xl shadow-lg shadow-[#DC5178]/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? (
                                <BiLoaderAlt className="animate-spin text-xl" />
                            ) : (
                                "Request Callback"
                            )}
                        </button>

                        <p className="text-[11px] text-center text-gray-500 font-jost">
                            By submitting, you agree to our privacy policy and terms of service.
                        </p>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TalkToExpertModal;
