"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from '../login/login.module.css'; // Reusing login styles for consistency

export default function OnboardingPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [university, setUniversity] = useState('Jupiter');
    const [major, setMajor] = useState('');
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            // Optionally redirect if not logged in, but newly registered users might take a moment to propagate
            // router.push('/login');
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

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1) {
            if (firstName && lastName) {
                setStep(2);
            } else {
                alert("Please fill in all required fields.");
            }
        }
    };

    const handleComplete = async (e) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            // Simulate slight delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Save onboarding status to localStorage since DB is unimplemented
            localStorage.setItem(`onboardingCompleted_${user.uid}`, 'true');
            localStorage.setItem(`userName_${user.uid}`, `${firstName} ${lastName}`);

            // Optionally save other fields if needed for static display elsewhere
            localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify({
                firstName,
                lastName,
                university,
                major,
                bio,
                onboardingCompleted: true
            }));

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
            <div className={styles.card}>
                <h1 className={styles.title}>Welcome!</h1>
                <p className={styles.subtitle}>Let's set up your profile.</p>

                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: step === 1 ? 'bold' : 'normal', color: step === 1 ? '#0070f3' : '#666' }}>1. Basic Info</span>
                    <span style={{ color: '#ccc' }}>&gt;</span>
                    <span style={{ fontWeight: step === 2 ? 'bold' : 'normal', color: step === 2 ? '#0070f3' : '#666' }}>2. Profile</span>
                </div>

                <form onSubmit={step === 1 ? handleNext : handleComplete} className={styles.form}>
                    {step === 1 && (
                        <>
                            <div className={styles.inputGroup}>
                                <label>First Name *</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className={styles.input}
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
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Major</label>
                                <input
                                    type="text"
                                    value={major}
                                    onChange={(e) => setMajor(e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Next</button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className={styles.inputGroup} style={{ textAlign: 'center' }}>
                                <label>Profile Picture</label>
                                <div style={{ margin: '10px auto', width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ color: '#aaa', fontSize: '30px' }}>📷</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'block', margin: '0 auto' }}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Bio</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => {
                                        setBio(e.target.value);
                                        // Auto-expand height
                                        e.target.style.height = 'inherit';
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    }}
                                    className={styles.textarea}
                                    placeholder="Tell us a bit about yourself..."
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                                    {loading ? 'Saving...' : 'Complete Profile'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
