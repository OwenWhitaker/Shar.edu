"use client";

import { useState } from 'react';
import { createRequestAction } from '../app/actions';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import styles from './BorrowButton.module.css';

export default function BorrowButton({ listingId, lenderId }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

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

    if (isSent) {
        return (
            <button className={`${styles.button} ${styles.sent}`} disabled>
                ✓ Request Sent
            </button>
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
