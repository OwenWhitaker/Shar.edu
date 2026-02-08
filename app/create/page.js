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
        // Redirect if not logged in (Mock)
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ padding: '6rem', textAlign: 'center' }}>
                <h2 className="text-h2">Join to Create</h2>
                <p className="text-sub" style={{ marginBottom: '2rem' }}>Please log in to list your items.</p>
                <button className="btn btn-primary" onClick={() => router.push('/login')}>
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Create Listing</h1>
                <p className={styles.subtitle}>Share your item with the community.</p>

                <form action={createListingAction} className={styles.form}>
                    <input type="hidden" name="lenderId" value={user.id} />

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="title">Item Title</label>
                        <input type="text" id="title" name="title" required placeholder="e.g. Sony Wireless Headphones" className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Photos</label>
                        <div className={styles.uploadBox}>
                            <ImageUpload name="image" />
                        </div>
                        <small className={styles.hint}>First image will be the cover.</small>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="description">Description</label>
                        <textarea id="description" name="description" required rows="5" placeholder="Describe condition, pickup location, etc..." className={styles.textarea}></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="tags">Tags</label>
                        <input type="text" id="tags" name="tags" placeholder="wireless, audio, sony" className={styles.input} />
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Publish Listing
                    </button>
                </form>
            </div>
        </div>
    );
}
