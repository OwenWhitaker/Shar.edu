"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from '../login/login.module.css'; // Reusing login styles for consistency

export default function OnboardingPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [major, setMajor] = useState('');
    const [bio, setBio] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleComplete = async (e) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            // Simulate slight delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Save to MongoDB
            const response = await fetch(`/api/user/${user.uid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    name: `${firstName} ${lastName}`,
                    major,
                    bio,
                    image: imagePreview, // Sending base64 string (not ideal for prod but works for MVP)
                    onboardingCompleted: true
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile in database');
            }

            // Save onboarding status to localStorage as fallback/cache
            localStorage.setItem(`onboardingCompleted_${user.uid}`, 'true');
            localStorage.setItem(`userName_${user.uid}`, `${firstName} ${lastName}`);

            // Redirect to home
            router.push('/');
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card} style={{ maxWidth: '600px' }}>
                <h1 className={styles.title}>Welcome!</h1>
                <p className={styles.subtitle}>Let's set up your profile.</p>

                <form onSubmit={handleComplete} className={styles.form} style={{ marginTop: '2rem' }}>
                    {/* Profile Image Section - Top for emphasis */}
                    <div className={styles.inputGroup} style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ margin: '10px auto', width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #eaeaea' }}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            )}
                        </div>
                        <label htmlFor="file-upload" className="btn btn-outline" style={{ cursor: 'pointer', display: 'inline-block', marginTop: '0.5rem', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                            Upload Photo
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.inputGroup}>
                            <label>First Name *</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className={styles.input}
                                placeholder="Jane"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Last Name *</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className={styles.input}
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Major</label>
                        <input
                            type="text"
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                            className={styles.input}
                            placeholder="Computer Science"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => {
                                setBio(e.target.value);
                                e.target.style.height = 'inherit';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            className={styles.textarea}
                            placeholder="Tell us a bit about yourself..."
                            rows={3}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Saving...' : 'Complete Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}
