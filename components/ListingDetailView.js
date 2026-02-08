"use client";

import { useState } from 'react';
import styles from './ListingDetailView.module.css';
import ContactInteraction from './ContactInteraction';
import BorrowButton from './BorrowButton';
import Link from 'next/link';
import StarRating from './StarRating';
import { useAuth } from '../app/context/AuthContext';

export default function ListingDetailView({ listing, requests = [], requestCount = 0 }) {
    const { user } = useAuth();
    const existingRequest = user ? requests.find(r => r.borrowerId === user.id) : null;

    // Initialize with 0
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!listing) return null;

    const allImages = listing.images && listing.images.length > 0 ? listing.images : [listing.image];
    // Ensure selectedIndex is valid
    const currentImage = allImages[selectedIndex] || allImages[0];

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {/* Left Column: Images */}
                <div className={styles.imageSection}>
                    <div className={styles.galleryContainer}>
                        {/* Main Large Display */}
                        <div className={styles.mainDisplay}>
                            <img
                                src={currentImage}
                                alt={listing.title}
                                className={styles.mainDisplayImage}
                                onClick={() => {
                                    const nextIndex = (selectedIndex + 1) % allImages.length;
                                    setSelectedIndex(nextIndex);
                                }}
                            />

                            {/* Navigation Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        className={styles.navButtonPrev}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const prevIndex = (selectedIndex - 1 + allImages.length) % allImages.length;
                                            setSelectedIndex(prevIndex);
                                        }}
                                    >
                                        ‹
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.navButtonNext}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const nextIndex = (selectedIndex + 1) % allImages.length;
                                            setSelectedIndex(nextIndex);
                                        }}
                                    >
                                        ›
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails Row (only if more than 1 image) */}
                        {allImages.length > 1 && (
                            <div className={styles.thumbnailRow}>
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`${styles.thumbnailButton} ${selectedIndex === index ? styles.active : ''}`}
                                        onClick={() => setSelectedIndex(index)}
                                    >
                                        <img
                                            src={img}
                                            alt={`View ${index + 1}`}
                                            className={styles.thumbnailImage}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
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
                            <span className={styles.requestCount}>🔥 {requestCount} interested</span>
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
                                    <span className={styles.lenderLabel}>Lended by</span>
                                    <div className={styles.lenderName}>{listing.lender?.name}</div>
                                    <div className={styles.lenderRating}>
                                        <span className={styles.ratingValue}>
                                            {listing.lender?.rating > 0 ? `${listing.lender.rating}/5` : 'No ratings yet'}
                                        </span>
                                        {listing.lender?.rating > 0 && <StarRating rating={listing.lender.rating} />}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className={styles.actionGroup}>
                        <BorrowButton
                            listingId={listing.id}
                            lenderId={listing.lender?.id}
                            existingRequest={existingRequest}
                        />
                        <ContactInteraction
                            lenderEmail={listing.lender?.email}
                            listingTitle={listing.title}
                            buttonLabel="Contact Lender"
                        />
                    </div>

                    <div className={styles.description}>
                        <h3 className={styles.sectionLabel}>About this item</h3>
                        <p className={styles.descriptionText}>{listing.description}</p>
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
