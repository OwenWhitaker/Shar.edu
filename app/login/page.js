"use client";

import { useState, useEffect, Suspense } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.css';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/';

    // Handle redirection if already logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push(returnUrl);
            }
        });
        return () => unsubscribe();
    }, [router, returnUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err) {
            console.error("Login Error:", err);
            setError("Incorrect email or password.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Log in to start sharing and borrowing.</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <p style={{ color: '#ff4d4d', fontSize: '0.85rem', marginBottom: '0.5rem', marginTop: '-0.5rem' }}>{error}</p>}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input
                            type="email"
                            placeholder="student@university.edu"
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

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Continue with Email'}
                    </button>

                    <p className={styles.footerText}>
                        Only verified university students can join.
                    </p>
                </form>
                <p className={styles.note}>
                    New here? <a href="/register" style={{ color: '#0070f3' }}>Create an account</a>
                </p>
                <p className={styles.note}>*Access restricted to Verified Students only.</p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className={styles.container}>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
