"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase'; // Importing the auth instance we just configured
import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from './login.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Added password state
    const [error, setError] = useState(''); // Added error state for feedback
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/';

    // Handle redirection if already logged in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                router.push(returnUrl);
            }
        });
        return () => unsubscribe();
    }, [router, returnUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirection is handled by the useEffect onAuthStateChanged listener
        } catch (err) {
            setError('Invalid email or password. Please try again.');
            console.error("Firebase Login Error:", err.code, err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Welcome to BorrowIt</h1>
                <p className={styles.subtitle}>The university peer-to-peer lending marketplace.</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">University Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>

                    {error && <p style={{ color: '#ff4d4d', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Continue with Email'}
                    </button>
                </form>
                <p className={styles.note}>*Access restricted to Verified Students only.</p>
            </div>
        </div>
    );
}