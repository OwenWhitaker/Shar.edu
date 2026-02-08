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
        try {
            // This line sends the data to your Firebase Dashboard
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err) {
            alert("Firebase error: " + err.message);
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

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
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

                    <p className={styles.footerText}>
                        Only verified university students can join.
                    </p>
                </form>
                <div className={styles.footerContainer}>
                    <p className={styles.footerNote}>
                        New here? <a href="/register" style={{ color: '#0070f3' }}>Create an account</a>
                    </p>
                    <p className={styles.footerNote}>*Access restricted to Verified Students only.</p>
                </div>
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
