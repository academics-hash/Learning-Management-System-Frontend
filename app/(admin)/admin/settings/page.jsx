"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    User,
    Mail,
    Lock,
    Bell,
    Globe,
    Camera,
    Save,
    ShieldCheck,
    Eye,
    EyeOff,
    Instagram,
    Linkedin,
    Twitter,
    Phone
} from 'lucide-react';
import {
    PageHeader,
    Card,
    Input,
    Button,
    Toggle,
    Divider,
    typography,
    Section,
    Badge,
    IconButton
} from '../components/AdminUI';
import { toast } from 'sonner';
import { useUpdateUserMutation, useChangePasswordMutation } from '@/feature/api/authApi';
import Image from 'next/image';

const AdminSettings = () => {
    const { user } = useSelector((state) => state.auth);
    const [updateUser, { isLoading: isUpdatingProfile }] = useUpdateUserMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

    // State for profile
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
    });

    // Use a reference to track if we've initialized the form to avoid redundant updates
    const [lastSyncId, setLastSyncId] = useState(null);

    // Sync profile state with user data from Redux
    if (user && user.id !== lastSyncId) {
        setLastSyncId(user.id);
        setProfile({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
        });
    }

    // State for password
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPass, setShowPass] = useState(false);

    // State for preferences
    const [prefs, setPrefs] = useState({
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: true,
        twoFactorAuth: false
    });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateUser(profile).unwrap();
            if (response.success) {
                toast.success(response.message || "Profile updated successfully");
            }
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update profile");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            const response = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }).unwrap();

            if (response.success) {
                toast.success(response.message || "Password changed successfully");
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            toast.error(error?.data?.message || "Failed to change password");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            <PageHeader
                title="Account Settings"
                description="Manage your profile, security preferences and account notifications"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-white border-2 border-pink-100 shadow-sm flex items-center justify-center overflow-hidden relative transition-colors">
                                    {user?.avatar ? (
                                        <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <User size={40} className="text-[#DC5178]" />
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm text-gray-500 hover:text-[#DC5178] transition-colors z-10">
                                    <Camera size={14} />
                                </button>
                            </div>
                            <div>
                                <h3 className={typography.h4}>{user?.name || 'Administrator'}</h3>
                                <p className={typography.small}>{user?.role || 'Admin'}</p>
                            </div>
                            <div className="w-full space-y-2 pt-4">
                                <div className="flex justify-center">
                                    <Badge variant="primary">Active Account</Badge>
                                </div>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-jost uppercase tracking-widest font-bold">
                                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                                </p>
                            </div>
                        </div>

                    </Card>
                </div>

                {/* Right Column: Settings Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Profile Section */}
                    <Section
                        title="General Information"
                        description="Update your personal details and contact settings"
                    >
                        <Card>
                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Full Name"
                                        placeholder="Enter your name"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    />
                                    <Input
                                        label="Phone Number"
                                        placeholder="Enter your phone"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    />
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Email Address"
                                            type="email"
                                            placeholder="admin@stackup.com"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button type="submit" icon={Save} loading={isUpdatingProfile}>Save Changes</Button>
                                </div>
                            </form>
                        </Card>
                    </Section>

                    {/* Security Section */}
                    <Section
                        title="Security & Password"
                        description="Manage your account password and security status"
                    >
                        <Card>
                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <div className="relative">
                                            <Input
                                                label="Current Password"
                                                type={showPass ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            />
                                            <div
                                                className="absolute right-3 top-[38px] text-gray-400 cursor-pointer"
                                                onClick={() => setShowPass(!showPass)}
                                            >
                                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </div>
                                        </div>
                                    </div>
                                    <Input
                                        label="New Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    />
                                    <Input
                                        label="Confirm New Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    />
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-start gap-3">
                                    <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-jost leading-relaxed">
                                        Use at least 8 characters, including letters, numbers and special symbols for a stronger password.
                                    </p>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button type="submit" icon={Lock} variant="secondary" loading={isChangingPassword}>Update Password</Button>
                                </div>
                            </form>
                        </Card>
                    </Section>

                    {/* Preferences Section */}
                    <Section
                        title="Notification Preferences"
                        description="Control which notifications you'd like to receive"
                    >
                        <Card padding="p-0 overflow-hidden">
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                <div className="p-6">
                                    <Toggle
                                        label="Email Notifications"
                                        description="Receive updates on system activity via email"
                                        checked={prefs.emailNotifications}
                                        onChange={() => setPrefs({ ...prefs, emailNotifications: !prefs.emailNotifications })}
                                    />
                                </div>
                                <div className="p-6">
                                    <Toggle
                                        label="Push Notifications"
                                        description="Real-time alerts in your browser"
                                        checked={prefs.pushNotifications}
                                        onChange={() => setPrefs({ ...prefs, pushNotifications: !prefs.pushNotifications })}
                                    />
                                </div>
                                <div className="p-6">
                                    <Toggle
                                        label="Two-Factor Authentication"
                                        description="Add an extra layer of security to your account"
                                        checked={prefs.twoFactorAuth}
                                        onChange={() => setPrefs({ ...prefs, twoFactorAuth: !prefs.twoFactorAuth })}
                                    />
                                </div>
                            </div>
                        </Card>
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
