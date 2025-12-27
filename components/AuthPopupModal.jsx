"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BiLoaderAlt } from 'react-icons/bi';
import { useLoginUserMutation, useRegisterUserMutation } from '@/feature/api/authApi';
import { toast } from 'sonner';
import Image from 'next/image';

const AuthPopupModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const hasShownModal = useRef(false);

    // Auth hooks
    const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation();
    const [registerUser, { isLoading: isRegisterLoading }] = useRegisterUserMutation();

    const isLoading = isLoginLoading || isRegisterLoading;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });


    // Show modal after 5 seconds if user is not authenticated
    useEffect(() => {
        if (isAuthenticated || hasShownModal.current) {
            return;
        }

        const timer = setTimeout(() => {
            setIsOpen(true);
            hasShownModal.current = true;
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, [isAuthenticated]);




    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isLogin) {
                // Login Flow
                const { email, password } = formData;
                const result = await loginUser({ email, password }).unwrap();
                toast.success("Logged in successfully!");

                // Role-based redirect
                const role = result?.user?.role;
                if (role === 'admin' || role === 'superadmin') {
                    router.push('/admin');
                } else if (role === 'sales') {
                    router.push('/sales');
                } else {
                    router.push('/');
                }
                setIsOpen(false);
            } else {
                // Register Flow
                const result = await registerUser(formData).unwrap();
                toast.success("Registration successful! Please login.");
                setIsLogin(true); // Switch to login mode
                setFormData({ name: '', email: '', phone: '', password: '' }); // Reset form
            }
        } catch (error) {
            console.error("Auth Failure:", {
                status: error?.status,
                data: error?.data,
                message: error?.message,
                original: error
            });
            const errorMsg = error?.data?.message || error?.error || "Something went wrong";
            toast.error(errorMsg);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ name: '', email: '', phone: '', password: '' });
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
                        {isLogin ? 'Welcome Back!' : 'Join Stackup Today'}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {isLogin
                            ? 'Sign in to continue your learning journey'
                            : 'Create an account to start learning'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                    {/* Name Field (Register Only) */}
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm font-normal font-lexend text-white">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required={!isLogin}
                                className="w-full h-12 px-4 bg-[#363538] border border-[#363538] rounded-lg focus:outline-none focus:border-[#DC5178] focus:ring-1 focus:ring-[#DC5178] transition-all font-lexend text-sm text-white placeholder:text-[#BCBEC0]"
                            />
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-normal font-lexend text-white">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="username@gmail.com"
                            required
                            className="w-full h-12 px-4 bg-[#363538] border border-[#363538] rounded-lg focus:outline-none focus:border-[#DC5178] focus:ring-1 focus:ring-[#DC5178] transition-all font-lexend text-sm text-white placeholder:text-[#BCBEC0]"
                        />
                    </div>

                    {/* Phone Field (Register Only) */}
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm font-normal font-lexend text-white">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required={!isLogin}
                                className="w-full h-12 px-4 bg-[#363538] border border-[#363538] rounded-lg focus:outline-none focus:border-[#DC5178] focus:ring-1 focus:ring-[#DC5178] transition-all font-lexend text-sm text-white placeholder:text-[#BCBEC0]"
                            />
                        </div>
                    )}

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-normal font-lexend text-white">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            minLength={8}
                            className="w-full h-12 px-4 bg-[#363538] border border-[#363538] rounded-lg focus:outline-none focus:border-[#DC5178] focus:ring-1 focus:ring-[#DC5178] transition-all font-lexend text-sm text-white placeholder:text-[#BCBEC0]"
                        />
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
                            isLogin ? 'Sign In' : 'Sign Up'
                        )}
                    </button>

                    {/* Toggle Mode */}
                    <div className="text-center mt-2">
                        <p className="text-gray-400 font-jost text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="text-[#DC5178] ml-1 hover:underline transition-colors font-medium"
                            >
                                {isLogin ? "Sign Up" : "Sign In"}
                            </button>
                        </p>
                    </div>

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

export default AuthPopupModal;
