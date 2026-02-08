import Link from 'next/link';
import { getListings } from '../lib/db';
import styles from './page.module.css';
import HeroClouds from '../components/HeroClouds';

export default function Home() {
    const listings = getListings();
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

                    <div className={styles.searchWrapper}>
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="Search for items..."
                                className={styles.heroSearchInput}
                            />
                            <button className={styles.heroSearchBtn}>
                                🔍
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Listings */}
            <section className={styles.featured}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>New Arrivals</h2>
                        <Link href="/search" className={styles.viewAllLink}>
                            View All <span className={styles.arrow}>→</span>
                        </Link>
                    </div>

                    <div className={styles.grid}>
                        {featuredListings.map(listing => (
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
                    </div>
                </div>
            </section>
        </div>
    );
}
