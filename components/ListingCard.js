"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './ListingCard.module.css';

export default function ListingCard({ listing }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = listing.images && listing.images.length > 0
        ? listing.images
        : [listing.image];

    const handlePrev = (e) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNext = (e) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const currentImage = images[currentImageIndex];

    return (
        <Link href={`/listings/${listing.id}`} className={styles.cardLink}>
            <div className={styles.card}>
                <div className={styles.cardImageContainer}>
                    <img
                        src={currentImage}
                        alt={listing.title}
                        className={styles.cardImage}
                    />

                    {/* Navigation Buttons - Only show if multiple images */}
                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                className={styles.navButtonPrev}
                                onClick={handlePrev}
                            >
                                ‹
                            </button>
                            <button
                                type="button"
                                className={styles.navButtonNext}
                                onClick={handleNext}
                            >
                                ›
                            </button>

                            {/* Dots Indicator */}
                            <div className={styles.dotsContainer}>
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`${styles.dot} ${idx === currentImageIndex ? styles.active : ''}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.cardContent}>
                    <div className={styles.cardText}>
                        <h3 className={styles.cardTitle}>{listing.title}</h3>
                        <p className={styles.cardMeta}>Posted by {listing.lender?.name}</p>
                    </div>
                    <span className={styles.lenderBadge}>
                        {listing.lender?.name?.[0] || 'U'}
                    </span>
                </div>
            </div>
        </Link>
    );
}
