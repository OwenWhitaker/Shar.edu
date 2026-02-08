"use client";

import styles from './RequestCard.module.css';
import Link from 'next/link';

export default function RequestCard({ request, type }) {
    const isIncoming = type === 'incoming';
    const partner = isIncoming ? request.borrower : request.lender;

    return (

        <div className={styles.card}>
            <Link href={`/requests/${request.id}`} className={styles.cardLink}>
                <div className={styles.header}>
                    <span className={`${styles.badge} ${styles[request.status]}`}>{request.status}</span>
                    <span className={styles.date}>{new Date(request.createdAt).toLocaleDateString()}</span>
                </div>

                <div className={styles.content}>
                    <div className={styles.itemInfo}>
                        <img src={request.listing.image} alt={request.listing.title} className={styles.image} />
                        <div>
                            <span className={styles.title}>{request.listing.title}</span>
                            <p className={styles.role}>
                                {isIncoming ? 'Requested by' : 'Request to'}: <span className={styles.partnerName}>{partner.name}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </Link>

            {isIncoming && request.status === 'pending' && (
                <div className={styles.actions}>
                    <button
                        className={styles.acceptBtn}
                        onClick={() => alert("TODO: Accept")}
                    >
                        Accept
                    </button>
                    <button
                        className={styles.rejectBtn}
                        onClick={() => alert("TODO: Decline")}
                    >
                        Decline
                    </button>
                </div>
            )}
        </div>
    );
}
