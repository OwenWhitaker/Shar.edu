"use client";

import { useState, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './login.module.css';

function LoginForm() {
    const [email, setEmail] = useState('');
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));
        login(email);
        setIsLoading(false);
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

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Continue with Email'}
                    </button>

                    <p className={styles.footerText}>
                        Only verified university students can join.
                    </p>
                </form>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div className={styles.container}>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
