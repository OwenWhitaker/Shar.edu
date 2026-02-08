"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export function RequireAuth({ children }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If not authenticated, redirect to login with return URL
        if (isAuthenticated === false) { // Assuming null is loading state, false is definitely logged out
            const returnUrl = encodeURIComponent(pathname);
            router.push(`/login?returnUrl=${returnUrl}`);
        }
    }, [isAuthenticated, router, pathname]);

    if (!isAuthenticated) {
        return null; // Or a loading spinner
    }

    return children;
}
