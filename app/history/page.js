"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './page.module.css';
import Link from 'next/link';

export default function HistoryPage() {
    const { user, isAuthenticated } = useAuth();
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetch(`/api/history?userId=${user.uid || user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setTrades(data);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch history:", err);
                    setLoading(false);
                });
        }
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <h2>Please login to view your history</h2>
                    <Link href="/login" className={styles.loginBtn}>Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Trade History</h1>
                <p className={styles.subtitle}>All your past borrows and lends in one place.</p>
            </div>

            {loading ? (
                <div className={styles.loading}>Loading your history...</div>
            ) : trades.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.icon}>📦</div>
                    <h3>No trades yet</h3>
                    <p>When you complete a borrow or lend, it will show up here.</p>
                    <Link href="/" className={styles.browseBtn}>Browse Items</Link>
                </div>
            ) : (
                <div className={styles.tradeList}>
                    {trades.map(trade => (
                        <div key={trade._id} className={styles.tradeCard}>
                            <div className={styles.tradeImage}>
                                <img src={trade.itemImage} alt={trade.itemTitle} />
                            </div>
                            <div className={styles.tradeInfo}>
                                <h3 className={styles.itemTitle}>{trade.itemTitle}</h3>
                                <div className={styles.tradeMeta}>
                                    <span>{trade.borrowerId === user.uid ? 'Borrowed from' : 'Lent to'} <strong>{trade.otherPartyName}</strong></span>
                                    <span className={styles.date}>
                                        {new Date(trade.completedAt).toLocaleDateString()} at {new Date(trade.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.statusBadge}>Completed</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
