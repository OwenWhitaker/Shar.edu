"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyListingsPage() {
    const { user, isAuthenticated } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && user) {
            fetch(`/api/listings/user?userId=${user.uid || user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setListings(data);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch user listings:", err);
                    setLoading(false);
                });
        }
    }, [isAuthenticated, user]);

    const deleteListing = async (id) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;

        try {
            const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setListings(prev => prev.filter(l => l.id !== id));
            } else {
                alert('Failed to delete listing');
            }
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Listings</h1>
                <p className={styles.subtitle}>Manage the items you have listed on Shar.edu</p>
            </div>

            {loading ? (
                <div className={styles.loading}>Loading your items...</div>
            ) : listings.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.icon}>🏷️</div>
                    <h3>No items listed yet</h3>
                    <p>Start sharing with the community today!</p>
                    <Link href="/create" className={styles.createBtn}>List an Item</Link>
                </div>
            ) : (
                <div className={styles.listingGrid}>
                    {listings.map(item => (
                        <div key={item.id} className={styles.itemCard}>
                            <div className={styles.imageBox}>
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className={styles.info}>
                                <h3 className={styles.itemTitle}>{item.title}</h3>
                                <p className={styles.requests}>
                                    {item.numRequests || 0} active request(s)
                                </p>
                            </div>
                            <div className={styles.actions}>
                                <button
                                    className={styles.viewBtn}
                                    onClick={() => router.push(`/listings/${item.id}`)}
                                >
                                    View
                                </button>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => deleteListing(item.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
