"use client";

import { useAuth } from '../context/AuthContext';
import { createListingAction } from '../actions';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ImageUpload from '../../components/ImageUpload';

export default function CreateListing() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect if not logged in
        // Note: In a real app we'd do this via middleware
        if (!isAuthenticated && typeof window !== 'undefined') {
            // Allow a moment for auth state to load or show loading spinner
            // For MVP we just show the form but disable it or redirect
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Please log in to create a listing.</h2>
                <button className="btn btn-primary" onClick={() => router.push('/login')}>
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create a New Listing</h1>
            <form action={createListingAction} className={styles.form}>
                <input type="hidden" name="lenderId" value={user.id} />

                <div className={styles.formGroup}>
                    <label htmlFor="title">Item Title</label>
                    <input type="text" id="title" name="title" required placeholder="e.g. Sony Wireless Headphones" className={styles.input} />
                </div>



                <div className={styles.formGroup}>
                    <label>Images</label>
                    <ImageUpload name="image" />
                    <small className={styles.hint}>First image will be used as the cover.</small>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" required rows="5" placeholder="Describe the condition and any terms..." className={styles.textarea}></textarea>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="tags">Tags (comma separated)</label>
                    <input type="text" id="tags" name="tags" placeholder="wireless, audio, sony" className={styles.input} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    Publish Listing
                </button>
            </form>
        </div>
    );
}
