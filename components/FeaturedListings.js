"use client";

import Link from 'next/link';
import { useAuth } from '../app/context/AuthContext';
import styles from '../app/page.module.css';

export default function FeaturedListings({ listings }) {
    const { user } = useAuth();

    // Filter out listings where the current user is the lender
    const filteredListings = user
        ? listings.filter(listing => listing.lenderId !== user.id)
        : listings;

    const displayListings = filteredListings.slice(0, 6);

    return (
        <div className={styles.grid}>
            {displayListings.map(listing => (
                <Link href={`/listings/${listing.id}`} key={listing.id} className={styles.cardLink}>
                    <div className="card">
                        <div className={styles.cardImageContainer}>
                            <img
                                src={listing.image}
                                alt={listing.title}
                                className={styles.cardImage}
                            />
                            <div className={styles.cardOverlay}>
                                <span className={styles.lenderBadge}>
                                    {listing.lender?.name?.[0] || 'U'}
                                </span>
                            </div>
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{listing.title}</h3>
                            <p className={styles.cardMeta}>Posted by {listing.lender?.name}</p>
                        </div>
                    </div>
                </Link>
            ))}
            {displayListings.length === 0 && (
                <p>No new listings available.</p>
            )}
        </div>
    );
}
