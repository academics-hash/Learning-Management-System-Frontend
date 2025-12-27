'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { useCreateContactMutation } from '@/feature/api/contactusApi';
import { toast } from 'sonner';

const AboutPage = () => {
    // Load saved info from localStorage on initial render
    const [formData, setFormData] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedInfo = localStorage.getItem('contactFormInfo');
            if (savedInfo) {
                const { name, email, phoneNumber } = JSON.parse(savedInfo);
                return { name, email, phoneNumber: phoneNumber || '', comment: '' };
            }
        }
        return { name: '', email: '', phoneNumber: '', comment: '' };
    });

    const [saveInfo, setSaveInfo] = useState(() => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('contactFormInfo');
        }
        return false;
    });

    const [createContact, { isLoading, isSuccess, isError, error, reset }] = useCreateContactMutation();

    // Handle success/error feedback
    useEffect(() => {
        if (isSuccess) {
            toast.success('Message sent successfully!', {
                description: 'Thank you for contacting us. We will get back to you soon.',
                duration: 5000,
            });

            // Reset form after a short delay to allow the success message to be seen
            const timer = setTimeout(() => {
                if (saveInfo) {
                    const savedInfo = localStorage.getItem('contactFormInfo');
                    if (savedInfo) {
                        const { name, email, phoneNumber } = JSON.parse(savedInfo);
                        setFormData({ name, email, phoneNumber: phoneNumber || '', comment: '' });
                    }
                } else {
                    setFormData({ name: '', email: '', phoneNumber: '', comment: '' });
                }
                reset();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isSuccess, saveInfo, reset]);

    useEffect(() => {
        if (isError) {
            const errorMessage = error?.data?.message || 'Failed to send message. Please try again.';
            toast.error('Error', {
                description: errorMessage,
                duration: 5000,
            });
        }
    }, [isError, error]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Save info to localStorage if checkbox is checked
        if (saveInfo) {
            localStorage.setItem('contactFormInfo', JSON.stringify({
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber
            }));
        } else {
            localStorage.removeItem('contactFormInfo');
        }

        // Submit to API
        try {
            await createContact(formData).unwrap();
        } catch (err) {
            // Error handling is done in useEffect
            console.error('Failed to send message:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Combined Contact Section */}
                <div className="rounded-[10px] p-8 lg:p-12 border border-gray-200 shadow-xl mt-8" style={{ backgroundColor: '#F8F8FB' }}>
                    {/* Need A Direct Line Section */}
                    <div className="mb-12">
                        <div className="grid lg:grid-cols-2 gap-8 items-start">
                            {/* Contact Info */}
                            <div>
                                <h2 className="font-lexend font-normal text-[30px] leading-[140%] capitalize text-gray-900 mb-4" style={{ maxWidth: '410px' }}>
                                    Need A Direct Line?
                                </h2>
                                <p className="font-normal text-base align-middle mb-8" style={{ fontFamily: 'DM Sans', lineHeight: '24px', maxWidth: '410px', color: '#374151' }}>
                                    Cras massa et odio donec faucibus in. Vitae pretium massa dolor ullamcorper lectus elit quam.
                                </p>

                                {/* Phone */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shrink-0 border border-purple-200">
                                        <Phone className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1 font-jost">Phone</p>
                                        <p className="text-gray-900 font-semibold text-lg font-inter">+91 62388 72311</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shrink-0 border border-purple-200">
                                        <Mail className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1 font-jost">Email</p>
                                        <p className="text-gray-900 font-semibold text-lg font-inter"> info@stackuplearninghub</p>
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="rounded-2xl overflow-hidden h-[280px] border border-gray-200 shadow-lg">
                                <iframe
                                    title="Stackup Learning Hub Location"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.451470698344!2d76.87297817506045!3d8.552510891491046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05b96d9794eb5b%3A0x826349c87c6746c7!2sStackup%20Learning%20Hub!5e0!3m2!1sen!2sin!4v1765969196276!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition-all duration-500"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-8"></div>

                    {/* Contact Form Section */}
                    <div>
                        <h2 className="font-lexend font-normal text-[30px] leading-[140%] capitalize text-gray-900 mb-2" style={{ maxWidth: '160px' }}>
                            Contact Us
                        </h2>
                        <p className="font-normal text-base align-middle mb-8" style={{ fontFamily: 'DM Sans', lineHeight: '24px', maxWidth: '502px', color: '#374151' }}>
                            Your email address will not be published. Required fields are marked
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5" style={{ maxWidth: '1290px' }}>
                            {/* Name and Email Row */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Name Input */}
                                <div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name*"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-pink/50 focus:border-primary-pink/50 transition-all duration-300 font-jost font-normal text-lg leading-[150%]"
                                        style={{ maxWidth: '603px' }}
                                    />
                                </div>

                                {/* Email Input */}
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email*"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-pink/50 focus:border-primary-pink/50 transition-all duration-300 font-jost font-normal text-lg leading-[150%]"
                                        style={{ maxWidth: '603px' }}
                                    />
                                </div>

                                {/* Phone Number Input */}
                                <div className="md:col-span-2">
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        placeholder="Phone Number*"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-pink/50 focus:border-primary-pink/50 transition-all duration-300 font-jost font-normal text-lg leading-[150%]"
                                        style={{ maxWidth: '603px' }}
                                    />
                                </div>
                            </div>


                            {/* Comment Textarea */}
                            <div>
                                <textarea
                                    name="comment"
                                    placeholder="Comment"
                                    value={formData.comment}
                                    onChange={handleChange}
                                    rows="6"
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-pink/50 focus:border-primary-pink/50 transition-all duration-300 resize-none font-jost font-normal text-lg leading-[150%]"
                                    style={{ maxWidth: '603px' }}
                                ></textarea>
                            </div>

                            {/* Checkbox */}
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="saveInfo"
                                    checked={saveInfo}
                                    onChange={(e) => setSaveInfo(e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-gray-300 bg-white text-primary-pink focus:ring-primary-pink/50 focus:ring-offset-0 cursor-pointer"
                                />
                                <label htmlFor="saveInfo" className="text-gray-600 text-sm font-jost cursor-pointer select-none">
                                    Save My Name, Email In This Browser For The Next Time I Comment
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="text-white transition-all duration-300 transform hover:scale-105 font-jost font-medium text-lg leading-[150%] capitalize gap-[10px] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    style={{
                                        width: '170px',
                                        height: '48px',
                                        borderRadius: '24px',
                                        paddingTop: '10px',
                                        paddingRight: '24px',
                                        paddingBottom: '10px',
                                        paddingLeft: '24px',
                                        backgroundColor: '#DC508A'
                                    }}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                                            <span>Posting...</span>
                                        </>
                                    ) : (
                                        'Post Comment'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default AboutPage;