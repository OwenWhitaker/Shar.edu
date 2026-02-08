"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import HeroClouds from '../components/HeroClouds';
import HeroSearch from '../components/HeroSearch';
import ListingCardSkeleton from '../components/ListingCardSkeleton';

export default function Home() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/listings')
            .then(res => res.json())
            .then(data => {
                setListings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch listings", err);
                setLoading(false);
            });
    }, []);

    const featuredListings = listings.slice(0, 6); // Show top 6

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <HeroClouds />
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Borrow what<br />you need.
                    </h1>
                    <p className={styles.heroSubtitle}>
                        The student marketplace.
                    </p>

                    <HeroSearch />
                </div>
            </section>

            {/* Featured Listings */}
            <section className={styles.featured}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Today&apos;s Top Picks</h2>
                        <Link href="/search" className={styles.viewAllLink}>
                            View All <span className={styles.arrow}>→</span>
                        </Link>
                    </div>

                    <div className={styles.grid}>
                        {loading && (
                            <>
                                <ListingCardSkeleton />
                                <ListingCardSkeleton />
                                <ListingCardSkeleton />
                            </>
                        )}
                        {!loading && featuredListings.map(listing => (
                            <Link href={`/listings/${listing.id}`} key={listing.id} className={styles.cardLink}>
                                <div className="card">
                                    <div className={styles.cardImageContainer}>
                                        <img
                                            src={listing.image}
                                            alt={listing.title}
                                            className={styles.cardImage}
                                        />
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
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
