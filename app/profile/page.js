"use client";

import { useAuth } from '../context/AuthContext';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import StarRating from '../../components/StarRating';

export default function PersonalProfile() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    // Local state for editing form
    const [bio, setBio] = useState('');
    const [major, setMajor] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user) {
            // Sync local state with user profile on load
            if (user.bio && bio !== user.bio) setBio(user.bio);
            if (user.major && major !== user.major) setMajor(user.major);
            if (user.image && imagePreview !== user.image) setImagePreview(user.image);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, user, router]);

    if (!user) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/user/${user.uid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bio,
                    major,
                    image: imagePreview
                }),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            // Refresh to show changes (since AuthContext doesn't auto-update from this API call yet)
            window.location.reload();
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        }
        setIsEditing(false);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>My Profile</h1>

            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.avatarLarge} style={{ position: 'relative' }}>
                        <img src={imagePreview || user.image} alt={user.name} className={styles.avatarImg} />
                        {isEditing && (
                            <>
                                <label htmlFor="pfp-upload" style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '50%'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                        <circle cx="12" cy="13" r="4" />
                                    </svg>
                                </label>
                                <input id="pfp-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                            </>
                        )}
                    </div>
                    <div>
                        <h2>{user.name}</h2>
                        <p className={styles.email}>{user.email}</p>
                        <div className={styles.rating}>
                            <span>
                                {user.rating > 0 ? `${user.rating}/5` : 'No ratings yet'}
                            </span>
                            {user.rating > 0 && <div style={{ marginTop: '0.25rem' }}><StarRating rating={user.rating} /></div>}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Major</label>
                        <input
                            type="text"
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                            disabled={!isEditing}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            disabled={!isEditing}
                            className={styles.textarea}
                            rows="4"
                        />
                    </div>

                    <div className={styles.actions}>
                        {isEditing ? (
                            <>
                                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </>
                        ) : (
                            <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                        )}
                    </div>
                </form>
            </div>

            <div className={styles.links}>
                <button className="btn btn-outline" style={{ width: '100%', marginBottom: '1rem' }} onClick={() => router.push('/history')}>
                    View Trade History
                </button>

                <button className="btn btn-outline" style={{ width: '100%', marginBottom: '1rem' }} onClick={() => router.push('/my-listings')}>
                    My Listings
                </button>

                <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => router.push(`/users/${user.id}`)}>
                    View Public Profile
                </button>

                <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', borderColor: '#d32f2f', color: '#d32f2f' }} onClick={() => {
                    logout();
                    router.push('/');
                }}>
                    Log Out
                </button>
            </div>
        </div>
    );
}
