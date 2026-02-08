"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './login.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const { login, isAuthenticated } = useAuth(); // Assuming login returns success/fail or we check state
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/';

    useEffect(() => {
        if (isAuthenticated) {
            router.push(returnUrl);
        }
    }, [isAuthenticated, router, returnUrl]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(email);
        if (success) {
            // The useEffect will handle the redirect
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
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Continue with Email
                    </button>
                </form>
                <p className={styles.note}>*Access restricted to Verified Students only.</p>
            </div>
        </div>
    );
}
