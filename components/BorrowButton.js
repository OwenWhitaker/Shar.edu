"use client";

import { useState } from 'react';
import { createRequestAction } from '../app/actions';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import styles from './BorrowButton.module.css';

export default function BorrowButton({ listingId, lenderId, existingRequest }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    // Determine current status (either from props or local state if just sent)
    const status = isSent ? 'pending' : existingRequest?.status;

    const handleBorrowClick = () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (user.id === lenderId) {
            alert("You can't borrow your own item!");
            return;
        }
        setShowInput(true);
    };

    const handleSendRequest = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await createRequestAction(listingId, lenderId, user.id, message);
            if (result.success) {
                setIsSent(true);
                setShowInput(false);
            } else {
                setError(result.error || "Failed to send request.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (status) {
        let statusClass = styles.pending;
        let statusText = "Request Pending";
        let icon = (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
        );

        if (status === 'accepted') {
            statusClass = styles.accepted;
            statusText = "Request Accepted";
            icon = (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            );
        } else if (status === 'rejected') {
            statusClass = styles.rejected;
            statusText = "Request Rejected";
            icon = (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            );
        }

        return (
            <div className={`${styles.statusBadge} ${statusClass}`}>
                <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span> {statusText}
            </div>
        );
    }

    if (showInput) {
        return (
            <div className={styles.inputContainer}>
                <textarea
                    className={styles.textarea}
                    placeholder="Optional: Why do you need this? (e.g. for a project due Friday)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                />
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.actions}>
                    <button
                        className={`${styles.button} ${styles.cancel}`}
                        onClick={() => setShowInput(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        className={`${styles.button} ${styles.confirm}`}
                        onClick={handleSendRequest}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Confirm Request'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            className={`${styles.button} ${styles.primary}`}
            onClick={handleBorrowClick}
        >
            Borrow it!
        </button>
    );
}
