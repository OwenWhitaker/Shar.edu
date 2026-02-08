"use client";

import styles from './RequestDetailView.module.css';
import Link from 'next/link';

export default function RequestDetailView({ request }) {
    if (!request) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Request Details</h2>
                <span className={`${styles.status} ${styles[request.status]}`}>{request.status}</span>
            </div>

            <div className={styles.section}>
                <label className={styles.label}>Sent On</label>
                <div className={styles.value}>{new Date(request.createdAt).toLocaleString()}</div>
            </div>

            <div className={styles.section}>
                <label className={styles.label}>Message</label>
                <div className={styles.messageBox}>
                    {request.message ? (
                        <p>{request.message}</p>
                    ) : (
                        <p className={styles.emptyMessage}>No message provided.</p>
                    )}
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Item Requested</h3>
                    <div className={styles.itemInfo}>
                        <img src={request.listing.image} alt={request.listing.title} className={styles.image} />
                        <div>
                            <Link href={`/listings/${request.listing.id}`} className={styles.link}>{request.listing.title}</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Involved Parties</h3>
                    <div className={styles.partyInfo}>
                        <p><strong>From:</strong> <Link href={`/users/${request.borrower.id}`} className={styles.link}>{request.borrower.name}</Link></p>
                        <p><strong>To:</strong> <Link href={`/users/${request.lender.id}`} className={styles.link}>{request.lender.name}</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
