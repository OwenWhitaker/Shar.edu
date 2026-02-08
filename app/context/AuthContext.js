"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Check local storage on load
        const storedUser = localStorage.getItem('borrowit_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email) => {
        // Mock login - just requires .edu email
        if (!email.endsWith('.edu')) {
            alert('Must use a valid .edu email address');
            return false;
        }

        // Simulate getting user data
        const mockUser = {
            id: 'u1',
            name: 'Owen Whitaker',
            email: email,
            image: 'https://api.dicebear.com/7.x/initials/svg?seed=OW',
            major: 'Computer Science'
        };

        setUser(mockUser);
        localStorage.setItem('borrowit_user', JSON.stringify(mockUser));
        router.push('/');
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('borrowit_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
