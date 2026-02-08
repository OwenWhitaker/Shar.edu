"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This is the "plug" that connects your site to Firebase
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);