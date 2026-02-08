"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './RequestCard.module.css';

export default function RequestCard({ request, type }) {
    const [status, setStatus] = useState(request.status);
    const [loading, setLoading] = useState(false);

    // Determine the other party's user object
    const otherUser = type === 'incoming' ? request.borrower : request.lender;
    const isPending = status === 'pending';

    const handleStatusUpdate = async (newStatus) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/requests/${request.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update request');
            }

            const data = await response.json();
            setStatus(data.status);
        } catch (error) {
            console.error('Error updating request:', error);
            alert('Failed to update request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = (e) => {
        e.preventDefault(); // Prevent Link navigation
        handleStatusUpdate('accepted');
    };

    const handleDecline = (e) => {
        e.preventDefault();
        handleStatusUpdate('declined');
    };

    return (
        <div className={styles.cardWrapper}>
            <Link href={`/requests/${request.id}`} className={styles.cardLink}>
                <div className={styles.card}>
                    <div className={styles.imageCol}>
                        <img
                            src={request.listing.image}
                            alt={request.listing.title}
                            className={styles.image}
                        />
                    </div>

                    <div className={styles.contentCol}>
                        <div className={styles.header}>
                            <span className={`${styles.statusBadge} ${styles[status]}`}>
                                {status}
                            </span>
                            <span className={styles.date}>
                                {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <h3 className={styles.title}>{request.listing.title}</h3>

                        <div className={styles.userInfo}>
                            <div className={styles.avatar}>
                                {otherUser.image ? (
                                    <img src={otherUser.image} alt={otherUser.name} />
                                ) : (
                                    otherUser.name[0]
                                )}
                            </div>
                            <span className={styles.userName}>
                                {type === 'incoming' ? 'From' : 'To'} {otherUser.name}
                            </span>
                        </div>

                        {type === 'incoming' && isPending && (
                            <div className={styles.actions}>
                                <button
                                    className={`${styles.btn} ${styles.btnAccept}`}
                                    onClick={handleAccept}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Accept'}
                                </button>
                                <button
                                    className={`${styles.btn} ${styles.btnDecline}`}
                                    onClick={handleDecline}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Decline'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
