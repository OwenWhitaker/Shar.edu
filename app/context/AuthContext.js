"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async (firebaseUser) => {
        if (!firebaseUser) return;

        let dbUser = {};
        // Sync user to MongoDB (ensure they exist)
        try {
            await fetch('/api/user/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL
                }),
            });

            // Fetch full profile data from MongoDB
            const res = await fetch(`/api/user/${firebaseUser.uid}`);
            if (res.ok) {
                dbUser = await res.json();
            }
        } catch (error) {
            console.error("Failed to sync/fetch user:", error);
        }

        const onboardingCompleted = localStorage.getItem(`onboardingCompleted_${firebaseUser.uid}`) === 'true';
        const tourCompleted = localStorage.getItem(`tourCompleted_${firebaseUser.uid}`) === 'true';
        const storedName = localStorage.getItem(`userName_${firebaseUser.uid}`) || '';

        const firstName = dbUser.firstName || (dbUser.name ? dbUser.name.split(' ')[0] : "First");
        const lastName = dbUser.lastName || (dbUser.name ? dbUser.name.split(' ').slice(1).join(' ') : "Last");

        // Prioritize DB data over Firebase/Local storage
        setUser({
            uid: firebaseUser.uid,
            id: firebaseUser.uid,
            email: firebaseUser.email,
            onboardingCompleted,
            tourCompleted,
            firstName,
            lastName,
            name: dbUser.name || (firstName && lastName ? `${firstName} ${lastName}` : "First Last"),
            bio: dbUser.bio || '',
            major: dbUser.major || '',
            image: dbUser.image || firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${firebaseUser.email}`,
            numListings: dbUser.numListings || 0,
            rating: dbUser.rating || 0
        });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                await refreshUser(firebaseUser);
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
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, logout, refreshUser: () => refreshUser(auth.currentUser) }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);