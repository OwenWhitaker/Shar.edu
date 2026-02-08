"use client";

import Link from 'next/link';
import styles from './RequestCard.module.css';

export default function RequestCard({ request, type }) {
    // Determine the other party's user object
    const otherUser = type === 'incoming' ? request.borrower : request.lender;
    const isPending = request.status === 'pending';

    const handleAccept = (e) => {
        e.preventDefault(); // Prevent Link navigation
        alert("Accept functionality would go here (Server Action)");
    };

    const handleDecline = (e) => {
        e.preventDefault();
        alert("Decline functionality would go here");
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
                            <span className={`${styles.statusBadge} ${styles[request.status]}`}>
                                {request.status}
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
                                <button className={`${styles.btn} ${styles.btnAccept}`} onClick={handleAccept}>
                                    Accept
                                </button>
                                <button className={`${styles.btn} ${styles.btnDecline}`} onClick={handleDecline}>
                                    Decline
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
