"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ErrorHandler({ children }) {
    const router = useRouter();

    useEffect(() => {
        // Handle unhandled promise rejections
        const handleUnhandledRejection = (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
            event.preventDefault();
            router.push('/not-found');
        };

        // Handle runtime errors
        const handleError = (event) => {
            console.error('Runtime Error:', event.error);
            event.preventDefault();
            router.push('/not-found');
        };

        // Add event listeners
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        window.addEventListener('error', handleError);

        // Cleanup
        return () => {
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            window.removeEventListener('error', handleError);
        };
    }, [router]);

    return <>{children}</>;
}
