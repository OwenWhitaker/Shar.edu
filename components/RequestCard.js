"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './RequestCard.module.css';

export default function RequestCard({ request, type }) {
    const [status] = useState(request.status);

    // Determine the other party's user object
    const otherUser = type === 'incoming' ? request.borrower : request.lender;
    const isPending = status === 'pending';

    // Determine the link destination
    const linkHref = type === 'incoming'
        ? `/requests/review/${request.id}`
        : `/listings/${request.listingId}`;

    return (
        <div className={styles.cardWrapper}>
            <Link href={linkHref} className={styles.cardLink}>
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
                            <div className={styles.reviewPrompt}>
                                <span className={styles.reviewText}>Click to review request →</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
