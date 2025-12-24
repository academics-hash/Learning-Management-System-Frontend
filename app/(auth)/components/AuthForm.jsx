"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BiLoaderAlt } from 'react-icons/bi';

import { useLoginUserMutation, useRegisterUserMutation, useVerifyEmailMutation, useVerifyOtpMutation, useSendResetOtpMutation, useResetPasswordMutation } from '@/feature/api/authApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const AuthForm = ({ type }) => {
    const isSignIn = type === 'sign-in';
    const router = useRouter();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // OTP states
    const [isVerifying, setIsVerifying] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [userId, setUserId] = useState(null);

    // Forgot Password states
    const [forgotPasswordStep, setForgotPasswordStep] = useState('none'); // 'none', 'email', 'otp', 'reset'
    const [resetEmail, setResetEmail] = useState('');
    const [resetOtp, setResetOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');

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
    const [verifyEmail, { isLoading: isVerifyLoading }] = useVerifyEmailMutation();
    const [sendResetOtp, { isLoading: isSendResetOtpLoading }] = useSendResetOtpMutation();
    const [resetPassword, { isLoading: isResetPasswordLoading }] = useResetPasswordMutation();

    // Derived loading state
    const isLoading = isLoginLoading || isRegisterLoading || isVerifyLoading || isSendResetOtpLoading || isResetPasswordLoading;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOtpChange = (e, index, type = 'verify') => {
        const value = e.target.value;
        if (isNaN(value)) return;

        if (type === 'verify') {
            const newOtp = [...otp];
            newOtp[index] = value.substring(value.length - 1);
            setOtp(newOtp);
        } else {
            const newOtp = [...resetOtp];
            newOtp[index] = value.substring(value.length - 1);
            setResetOtp(newOtp);
        }

        // Auto focus next
        if (value && index < 5) {
            const nextId = type === 'verify' ? `otp-${index + 1}` : `reset-otp-${index + 1}`;
            document.getElementById(nextId).focus();
        }
    };

    const handleKeyDown = (e, index, type = 'verify') => {
        if (e.key === 'Backspace' && index > 0) {
            const currentVal = type === 'verify' ? otp[index] : resetOtp[index];
            if (!currentVal) {
                const prevId = type === 'verify' ? `otp-${index - 1}` : `reset-otp-${index - 1}`;
                document.getElementById(prevId).focus();
            }
        }
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
                toast.success(result.message || "Registration successful! Verification code sent.");
                setUserId(result.userId);
                setIsVerifying(true);
            }
        } catch (error) {
            console.error("Auth Failure:", error);
            const errorMsg = error?.data?.message || "Something went wrong";
            toast.error(errorMsg);
        }
    };

    const [resendOtp, { isLoading: isResendLoading }] = useVerifyOtpMutation();

    const handleResendOtp = async () => {
        try {
            await resendOtp({ userId }).unwrap();
            toast.success("Verification code resent!");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to resend code");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length < 6) {
            toast.error("Please enter the full 6-digit OTP");
            return;
        }

        try {
            const result = await verifyEmail({ userId, otp: otpValue }).unwrap();
            toast.success("Email verified successfully!");
            // Redirection is handled by the useEffect watching isAuthenticated
        } catch (error) {
            toast.error(error?.data?.message || "Invalid OTP");
        }
    };

    // Forgot Password Handlers
    const handleSendResetOtp = async (e) => {
        e.preventDefault();
        try {
            await sendResetOtp({ email: resetEmail }).unwrap();
            toast.success("If an account exists, a reset code has been sent.");
            setForgotPasswordStep('otp');
        } catch (error) {
            toast.error(error?.data?.message || "Failed to send reset code");
        }
    };

    const handleVerifyResetOtp = (e) => {
        e.preventDefault();
        const otpValue = resetOtp.join('');
        if (otpValue.length < 6) {
            toast.error("Please enter the full 6-digit OTP");
            return;
        }
        setForgotPasswordStep('reset');
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const otpValue = resetOtp.join('');
            await resetPassword({
                email: resetEmail,
                otp: otpValue,
                newPassword: newPassword
            }).unwrap();
            toast.success("Password reset successful! You can now login.");
            setForgotPasswordStep('none');
            // Reset fields
            setResetEmail('');
            setResetOtp(['', '', '', '', '', '']);
            setNewPassword('');
        } catch (error) {
            toast.error(error?.data?.message || "Failed to reset password");
        }
    };

    // Verify OTP Screen (Admin/Premium Theme)
    if (isVerifying) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center px-4 py-8 bg-transparent">
                <div className="w-full max-w-[454px] bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10 flex flex-col items-center gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-2 w-full max-w-[200px] h-[40px]">
                        <div className="relative w-full h-full">
                            <Image
                                src="/image/logo.png"
                                alt="Stackup Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>

                    <div className="text-center space-y-3">
                        <h2 className="text-2xl md:text-3xl font-bold font-lexend text-white leading-tight">
                            Verify Your Email
                        </h2>
                        <p className="text-[14px] md:text-[15px] text-gray-300 font-lexend leading-relaxed">
                            We&apos;ve sent a 6-digit verification code to <br />
                            <span className="text-[#DC5178] font-semibold">{formData.email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-8">
                        {/* OTP Input Boxes */}
                        <div className="flex justify-between gap-2 md:gap-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index, 'verify')}
                                    onKeyDown={(e) => handleKeyDown(e, index, 'verify')}
                                    className="w-10 h-12 md:w-14 md:h-16 text-center text-xl md:text-2xl font-bold bg-white/5 border-2 border-white/10 rounded-xl focus:outline-none focus:border-[#DC5178] focus:ring-0 transition-all text-white shadow-sm"
                                    required
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <button
                            type="submit"
                            disabled={isVerifyLoading}
                            className="w-full h-[50px] md:h-[56px] bg-[#DC5178] text-white rounded-full font-bold font-lexend text-[16px] md:text-[18px] hover:bg-[#c03e62] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isVerifyLoading ? <BiLoaderAlt className="animate-spin text-2xl" /> : 'Verify & Continue'}
                        </button>

                        {/* Back to Register / Resend */}
                        <div className="text-center space-y-4">
                            <p className="text-gray-400 font-lexend text-[14px]">
                                Didn&apos;t receive the code?
                                <button
                                    type="button"
                                    disabled={isResendLoading}
                                    className="text-[#DC5178] ml-2 font-bold hover:underline disabled:opacity-50"
                                    onClick={handleResendOtp}
                                >
                                    {isResendLoading ? "Resending..." : "Resend OTP"}
                                </button>
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsVerifying(false)}
                                className="text-gray-400 text-sm hover:text-gray-600 font-medium font-lexend transition-colors"
                            >
                                ← Back to registration
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Forgot Password Flow
    if (forgotPasswordStep !== 'none') {
        return (
            <div className="w-full min-h-screen flex items-center justify-center px-4 py-8 bg-transparent">
                <div className="w-full max-w-[454px] bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10 flex flex-col items-center gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-2 w-full max-w-[200px] h-[40px]">
                        <div className="relative w-full h-full">
                            <Image
                                src="/image/logo.png"
                                alt="Stackup Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>

                    {/* Step 1: Email Input */}
                    {forgotPasswordStep === 'email' && (
                        <>
                            <div className="text-center space-y-3">
                                <h2 className="text-2xl md:text-3xl font-bold font-lexend text-white leading-tight">
                                    Forgot Password?
                                </h2>
                                <p className="text-[14px] md:text-[15px] text-gray-300 font-lexend leading-relaxed">
                                    Enter your email address and we&apos;ll send you <br />
                                    a 6-digit code to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSendResetOtp} className="w-full flex flex-col gap-6">
                                <div className="space-y-2">
                                    <label className="text-[14px] font-semibold font-lexend text-white">Email Address</label>
                                    <input
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full h-[52px] px-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#DC5178] focus:ring-1 focus:ring-[#DC5178] transition-all font-lexend text-[15px] text-white placeholder:text-gray-400"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-[56px] bg-[#DC5178] text-white rounded-full font-bold font-lexend text-[16px] md:text-[18px] hover:bg-[#c03e62] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isSendResetOtpLoading ? <BiLoaderAlt className="animate-spin text-2xl" /> : 'Send Reset Code'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setForgotPasswordStep('none')}
                                    className="text-gray-400 text-sm hover:text-gray-600 font-medium font-lexend transition-colors text-center"
                                >
                                    ← Back to Login
                                </button>
                            </form>
                        </>
                    )}

                    {/* Step 2: OTP Input */}
                    {forgotPasswordStep === 'otp' && (
                        <>
                            <div className="text-center space-y-3">
                                <h2 className="text-2xl md:text-3xl font-bold font-lexend text-white leading-tight">
                                    Check Your Email
                                </h2>
                                <p className="text-[14px] md:text-[15px] text-gray-300 font-lexend leading-relaxed">
                                    We&apos;ve sent a reset code to <br />
                                    <span className="text-[#DC5178] font-semibold">{resetEmail}</span>
                                </p>
                            </div>

                            <form onSubmit={handleVerifyResetOtp} className="w-full flex flex-col gap-8">
                                <div className="flex justify-between gap-2 md:gap-3">
                                    {resetOtp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`reset-otp-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(e, index, 'reset')}
                                            onKeyDown={(e) => handleKeyDown(e, index, 'reset')}
                                            className="w-10 h-12 md:w-14 md:h-16 text-center text-xl md:text-2xl font-bold bg-white/5 border-2 border-white/10 rounded-xl focus:outline-none focus:border-[#DC5178] focus:ring-0 transition-all text-white shadow-sm"
                                            required
                                        />
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-[56px] bg-[#DC5178] text-white rounded-full font-bold font-lexend text-[16px] md:text-[18px] hover:bg-[#c03e62] transition-all active:scale-[0.98] flex items-center justify-center"
                                >
                                    Verify Code
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setForgotPasswordStep('email')}
                                        className="text-gray-400 text-sm hover:text-gray-600 font-medium font-lexend transition-colors"
                                    >
                                        ← Error in email? Go back
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {/* Step 3: New Password */}
                    {forgotPasswordStep === 'reset' && (
                        <>
                            <div className="text-center space-y-3">
                                <h2 className="text-2xl md:text-3xl font-bold font-lexend text-white leading-tight">
                                    Set New Password
                                </h2>
                                <p className="text-[14px] md:text-[15px] text-gray-300 font-lexend leading-relaxed">
                                    Choose a strong password to <br />
                                    secure your account.
                                </p>
                            </div>

                            <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-6">
                                <div className="space-y-2">
                                    <label className="text-[14px] font-semibold font-lexend text-white">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="At least 8 characters"
                                        minLength={8}
                                        required
                                        className="w-full h-[52px] px-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#DC5178] focus:ring-1 focus:ring-[#DC5178] transition-all font-lexend text-[15px] text-white placeholder:text-gray-400"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isResetPasswordLoading}
                                    className="w-full h-[56px] bg-[#DC5178] text-white rounded-full font-bold font-lexend text-[16px] md:text-[18px] hover:bg-[#c03e62] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isResetPasswordLoading ? <BiLoaderAlt className="animate-spin text-2xl" /> : 'Reset Password'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        );
    }

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
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setForgotPasswordStep('email')}
                                className="text-[13px] font-normal font-lexend text-[#DC5178] hover:underline cursor-pointer"
                            >
                                Forgot Password?
                            </button>
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