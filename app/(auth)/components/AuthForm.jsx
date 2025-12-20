"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BiLoaderAlt } from 'react-icons/bi';

import { useLoginUserMutation, useRegisterUserMutation } from '@/feature/api/authApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const AuthForm = ({ type }) => {
    const isSignIn = type === 'sign-in';
    const router = useRouter();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            const role = user?.role;
            if (role === 'admin' || role === 'superadmin') {
                router.push('/admin');
            } else if (role === 'sales') {
                router.push('/sales');
            } else {
                router.push('/');
            }
        }
    }, [isAuthenticated, user, router]);

    // Auth hooks
    const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation();
    const [registerUser, { isLoading: isRegisterLoading }] = useRegisterUserMutation();

    // Derived loading state
    const isLoading = isLoginLoading || isRegisterLoading;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isSignIn) {
                // Login Flow
                const { email, password } = formData;
                const result = await loginUser({ email, password }).unwrap();
                console.log("Login Success:", result);
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
            } else {
                // Register Flow
                const result = await registerUser(formData).unwrap();
                console.log("Register Success:", result);
                toast.success("Registration successful! Please login.");
                router.push('/login'); // Redirect to login
            }
        } catch (error) {
            console.error("Auth Failure:", error);
            const errorMsg = error?.data?.message || "Something went wrong";
            toast.error(errorMsg);
        }
    };

    return (
        <div className="w-full max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center justify-center px-4 py-8 md:px-6 md:py-10 lg:p-4">

            {/* Left Side - Form */}
            <div className="w-full max-w-[454px] min-h-0 lg:min-h-[617px] mx-auto flex flex-col justify-center gap-4 md:gap-5 lg:gap-6">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 mb-2 w-full max-w-[250px] md:max-w-[350px] lg:w-[400px] h-[40px] md:h-[45px] lg:h-[50px]">
                    <div className="relative w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-50">
                        <Image
                            src="/image/logo.png"
                            alt="Stackup Logo"
                            fill
                            className="object-contain"
                        />
                    </div>

                </Link>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4 lg:gap-5">

                    {/* Name Field (Sign Up Only) */}
                    {!isSignIn && (
                        <div className="space-y-1">
                            <label className="text-[13px] font-normal font-lexend text-white leading-none">Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    required={!isSignIn}
                                    className="w-full h-[46px] md:h-[50px] lg:h-[52px] px-3 md:px-4 bg-[#363538] border border-[#363538] rounded-lg focus:outline-none focus:border-[#DC5178] focus:ring-1 focus:ring-[#DC5178] transition-all font-lexend text-[12px] md:text-[13px] leading-none text-white placeholder:text-[#BCBEC0]"
                                />
                            </div>
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="space-y-1">
                        <label className="text-[13px] font-normal font-lexend text-white leading-none">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="username@gmail.com"
                                required
                                className="w-full h-[46px] md:h-[50px] lg:h-[52px] px-3 md:px-4 bg-[#363538] border border-[#363538] rounded-lg focus:outline-none focus:border-[#DC5178] focus:ring-1 focus:ring-[#DC5178] transition-all font-lexend text-[12px] md:text-[13px] leading-none text-white placeholder:text-[#BCBEC0]"
                            />
                        </div>
                    </div>

                    {/* Phone Field (Sign Up Only) */}
                    {!isSignIn && (
                        <div className="space-y-1">
                            <label className="text-[13px] font-normal font-lexend text-white leading-none">Phone</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    required={!isSignIn}
                                    className="w-full h-[46px] md:h-[50px] lg:h-[52px] px-3 md:px-4 bg-[#363538] border border-[#363538] rounded-lg focus:outline-none focus:border-[#DC5178] focus:ring-1 focus:ring-[#DC5178] transition-all font-lexend text-[12px] md:text-[13px] leading-none text-white placeholder:text-[#BCBEC0]"
                                />
                            </div>
                        </div>
                    )}

                    {/* Password Field */}
                    <div className="space-y-1">
                        <label className="text-[13px] font-normal font-lexend text-white leading-none">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                minLength={8}
                                className="w-full h-[46px] md:h-[50px] lg:h-[52px] px-3 md:px-4 bg-[#363538] border border-[#363538] rounded-lg focus:outline-none focus:border-[#DC5178] focus:ring-1 focus:ring-[#DC5178] transition-all font-lexend text-[12px] md:text-[13px] leading-none text-white placeholder:text-[#BCBEC0]"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-white">
                                {/* Eye Icon Placeholder if needed, ignoring for now as per minimal reqs, but nice to have */}
                            </div>
                        </div>
                    </div>

                    {/* Forgot Password */}
                    {isSignIn && (
                        <div className="flex justify-start">
                            <label className="text-[13px] font-normal font-lexend text-white leading-none">Forgot Password?</label>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-[46px] md:h-[48px] lg:h-[50px] mt-2 bg-[#DC5178] text-white rounded-full font-medium font-lexend text-[14px] md:text-[15px] lg:text-[16px] hover:bg-[#c03e62] transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <BiLoaderAlt className="animate-spin text-xl" /> : (isSignIn ? 'Sign In' : 'Sign Up')}
                    </button>



                    {/* Switch Links */}
                    <div className="text-center mt-4">
                        <p className="text-gray-400 font-jost text-[14px]">
                            {isSignIn ? "Don't have an account yet?" : "Already have an account?"}
                            <Link
                                href={isSignIn ? "/register" : "/login"}
                                className="text-white ml-1 hover:underline transition-colors"
                            >
                                {isSignIn ? "Register for free" : "Sign In"}
                            </Link>
                        </p>
                    </div>

                </form>
            </div>

            {/* Right Side - Info Card (Hidden on small screens) */}
            <div className="hidden lg:flex w-full h-[600px] relative items-center justify-center">
                <div className="w-[509px] h-[473px] p-10 rounded-[6px] bg-white/5 backdrop-blur-md border border-white/10 flex flex-col justify-center gap-6 shadow-2xl">

                    {/* Icon */}
                    <div className="w-[55px] h-[55px] relative">
                        <Image
                            src="/image/device.png"
                            alt="Device Icon"
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        <h2 className="text-[22.95px] font-medium font-lexend text-[#D75287] leading-none capitalize">
                            Some Content About the Coding Information
                        </h2>
                        <p className="text-white font-montserrat text-[14px] leading-[22px] font-normal">
                            Three beta clinics launch NovaMed with full platform Three beta clinics launch NovaMed with full platform functionality.
                        </p>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex items-center gap-2 mt-4">
                        <div className="w-[91px] h-[8px] bg-[#D75287] rounded-[1px]"></div>
                        <div className="w-[8px] h-[8px] bg-[#D9D9D95E] rounded-[1px]"></div>
                        <div className="w-[8px] h-[8px] bg-[#D9D9D95E] rounded-[1px]"></div>
                        <div className="w-[8px] h-[8px] bg-[#D9D9D95E] rounded-[1px]"></div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default AuthForm;