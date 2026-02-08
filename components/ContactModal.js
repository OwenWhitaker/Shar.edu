"use client";

import { useState } from 'react';
import styles from './ContactModal.module.css';
import { useAuth } from '../app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ContactModal({ isOpen, onClose, lenderEmail, listingTitle }) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const subject = listingTitle
        ? `BorrowIt: Request to borrow ${listingTitle}`
        : `BorrowIt: Borrow request`;

    const defaultBody = `Hi,\n\nI'm interested in borrowing your item${listingTitle ? ` (${listingTitle})` : ''}.\n\nAre you available to meet up on campus?\n\nThanks,\n${user?.name || 'Student'}\n${user?.email}`;

    const [emailBody, setEmailBody] = useState(defaultBody);

    if (!isOpen) return null;

    const handleOpenEmail = () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        const mailto = `mailto:${lenderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailto;
        onClose();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`To: ${lenderEmail}\nSubject: ${subject}\n\n${emailBody}`);
        alert('Copied to clipboard!');
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Contact Lender</h2>

                <div className={styles.field}>
                    <label>To:</label>
                    <div className={styles.value}>{lenderEmail}</div>
                </div>

                <div className={styles.field}>
                    <label>Subject:</label>
                    <div className={styles.value}>{subject}</div>
                </div>

                <div className={styles.field}>
                    <label>Message Preview:</label>
                    <textarea
                        className={styles.preview}
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                    />
                </div>

                <div className={styles.actions}>
                    <button className="btn btn-primary" onClick={handleOpenEmail}>Open Email App</button>
                    <button className="btn btn-outline" onClick={handleCopy}>Copy Text</button>
                    <button className="btn btn-outline" style={{ border: 'none' }} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
