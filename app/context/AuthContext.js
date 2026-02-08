"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This is the "plug" that connects your site to Firebase
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Fetch additional user data from localStorage since DB is unimplemented
                const onboardingCompleted = localStorage.getItem(`onboardingCompleted_${firebaseUser.uid}`) === 'true';
                const tourCompleted = localStorage.getItem(`tourCompleted_${firebaseUser.uid}`) === 'true';
                const storedName = localStorage.getItem(`userName_${firebaseUser.uid}`) || '';

                setUser({
                    ...firebaseUser,
                    onboardingCompleted,
                    tourCompleted,
                    name: storedName || firebaseUser.displayName || firebaseUser.email.split('@')[0]
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);