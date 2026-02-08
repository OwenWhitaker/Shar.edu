"use client";

import Link from 'next/link';
import styles from '../app/page.module.css';
import HeroClouds from './HeroClouds';
import HeroSearch from './HeroSearch';
import { useAuth } from '../app/context/AuthContext';

export default function HomeClient({ featuredListings }) {
    const { user, isAuthenticated } = useAuth();

    const handleRestartTour = () => {
        window.dispatchEvent(new CustomEvent('startGuidedTour'));
    };

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
                        <h2 className={styles.sectionTitle}>So much to borrow, so little time...</h2>
                        <Link href="/search" className={styles.viewAllLink}>
                            View All <span className={styles.arrow}>→</span>
                        </Link>
                    </div>

                    <div className={styles.grid}>
                        {featuredListings.map((listing, index) => (
                            <Link href={`/listings/${listing.id}`} key={listing.id} id={index === 0 ? 'first-listing' : undefined} className={styles.cardLink}>
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
                    </div>
                </div>
            </section>

            {/* Help/Restart Tour Button */}
            <button
                onClick={handleRestartTour}
                style={{
                    position: 'fixed',
                    bottom: '100px', // Above the bottom nav
                    right: '25px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 5px 15px rgba(230, 42, 16, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    zIndex: 100,
                    transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                aria-label="Restart Guided Tour"
            >
                ?
            </button>
        </div>
    );
}
