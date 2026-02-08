"use client";

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import styles from '../login/login.module.css'; // Reusing your login styles

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateEmail = (email) => {
        // Regex for XXXX@XXX.edu format where X can be any number of characters/digits
        // We enforce standard email characters before @, then standard domain chars, ending in .edu (case insensitive)
        const regex = /^[^@]+@[^@]+\.edu$/i;
        return regex.test(email);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const trimmedEmail = email.trim();
        console.log("Validating signup email:", trimmedEmail);

        if (!validateEmail(trimmedEmail)) {
            setLoading(false);
            console.log("Signup validation failed");
            setError('Please use a valid .edu email address to register.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
            const user = userCredential.user;

            // Create user in MongoDB
            await fetch(`/api/user/${user.uid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    username: trimmedEmail.split('@')[0], // Default username
                }),
            });

            router.push('/onboarding'); // Redirect to onboarding after success
        } catch (err) {
            setError(err.message);
            console.error("Signup Error:", err.code);
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Join Borrowit!</h1>
                <p className={styles.subtitle}>Create your university student account.</p>

                <form onSubmit={handleSignUp} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">University Email</label>
                        <input
                            type="email"
                            placeholder="you@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Create Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>

                    {error && <p style={{ color: 'red', fontSize: '0.8rem' }}>{error}</p>}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <button onClick={() => router.push('/login')} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', marginTop: '1rem' }}>
                    Already have an account? Log in
                </button>
            </div>
        </div>
    );
}