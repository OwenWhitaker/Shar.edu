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
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else if (user) {
            setBio(user.bio || '');
            setMajor(user.major || '');
        }
    }, [isAuthenticated, user, router]);

    if (!user) return null;

    const handleSave = (e) => {
        e.preventDefault();
        // In a real app, update context/DB
        setIsEditing(false);
        alert("Profile updated (Mock)");
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>My Profile</h1>

            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.avatarLarge}>
                        <img src={user.image} alt={user.name} className={styles.avatarImg} />
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
