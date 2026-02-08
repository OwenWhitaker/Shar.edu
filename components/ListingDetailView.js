"use client";

import styles from './ListingDetailView.module.css';
import ContactInteraction from './ContactInteraction';
import BorrowButton from './BorrowButton';
import Link from 'next/link';

export default function ListingDetailView({ listing, requestCount = 0 }) {
    if (!listing) return null;

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {/* Left Column: Images */}
                <div className={styles.imageSection}>
                    <div className={styles.mainImageContainer}>
                        <img src={listing.image} alt={listing.title} className={styles.mainImage} />
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className={styles.detailsSection}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{listing.title}</h1>
                    </div>

                    <div className={styles.meta}>
                        <span className={styles.date}>Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
                        {requestCount > 0 && (
                            <>
                                <span className={styles.divider}>•</span>
                                <span className={styles.requestCount}>🔥 {requestCount} already requesting</span>
                            </>
                        )}
                    </div>

                    <div className={styles.lenderCard}>
                        <Link href={`/users/${listing.lender?.id}`} className={styles.lenderLink}>
                            <div className={styles.lenderHeader}>
                                <div className={styles.lenderAvatar}>
                                    {listing.lender?.image ? (
                                        <img src={listing.lender.image} alt={listing.lender.name} className={styles.avatarImg} />
                                    ) : (
                                        <div className={styles.avatarPlaceholder}>{listing.lender?.name?.[0]}</div>
                                    )}
                                </div>
                                <div className={styles.lenderInfo}>
                                    <div className={styles.lenderName}>{listing.lender?.name}</div>
                                    <div className={styles.lenderMajor}>{listing.lender?.major}</div>
                                    <div className={styles.lenderRating}>⭐ {listing.lender?.rating} (12 reviews)</div>
                                </div>
                            </div>
                        </Link>

                        <ContactInteraction
                            lenderEmail={listing.lender?.email}
                            listingTitle={listing.title}
                            buttonLabel="Contact Lender"
                        />

                        <BorrowButton
                            listingId={listing.id}
                            lenderId={listing.lender?.id}
                        />
                    </div>

                    <div className={styles.description}>
                        <h3>Description</h3>
                        <p>{listing.description}</p>
                    </div>

                    <div className={styles.tags}>
                        {listing.tags?.map(tag => (
                            <span key={tag} className={styles.tag}>#{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
