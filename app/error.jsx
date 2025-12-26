"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({ error, reset }) {
    const router = useRouter();

    useEffect(() => {
        // Log error to console for debugging
        console.error('Application Error:', error);

        // Redirect to 404 page after a brief moment
        const timer = setTimeout(() => {
            router.push('/not-found');
        }, 100);

        return () => clearTimeout(timer);
    }, [error, router]);

    // Optional: You can show a brief loading state before redirect
    // Or directly return null to show nothing during redirect
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a73e8] mx-auto"></div>
                <p className="mt-4 text-gray-600">Redirecting...</p>
            </div>
        </div>
    );
}
