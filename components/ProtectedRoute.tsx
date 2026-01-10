'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: ('admin' | 'employee')[];
    redirectTo?: string;
}

export const ProtectedRoute = ({
    children,
    allowedRoles,
    redirectTo = '/login'
}: ProtectedRouteProps) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push(redirectTo);
        } else if (!loading && user && allowedRoles && allowedRoles.length > 0) {
            if (!allowedRoles.includes(user.role)) {
                const userDashboard = user.role === 'admin' ? '/admin' : '/employee';
                router.push(userDashboard);
            }
        }
    }, [user, loading, router, allowedRoles, redirectTo]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-vh-100 bg-white">
                <div className="spinner"></div>
                <p className="ml-4">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
};

