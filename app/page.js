import Link from 'next/link';
import { getListings } from '../lib/db';
import styles from './page.module.css';

export default function Home() {
    const listings = getListings();
    const featuredListings = listings.slice(0, 6); // Show top 6

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Borrow what you need,<br />lend what you don't.</h1>
                    <p className={styles.heroSubtitle}>The trusted peer-to-peer marketplace exclusively for university students.</p>

                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Search for textbooks, electronics, gear..."
                            className={styles.heroSearchInput}
                        />
                        <button className={`${styles.heroSearchBtn} btn btn-primary`}>
                            Search
                        </button>
                    </div>

                    <div className={styles.trustBadges}>
                        <span>🎓 Verified Students Only</span>
                        <span>🔒 Secure Platform</span>
                        <span>📍 On Campus</span>
                    </div>
                </div>
            </section>

            {/* Featured Listings */}
            <section className={styles.featured}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>New Arrivals on Campus</h2>
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
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h3 className={styles.cardTitle}>{listing.title}</h3>
                                        <p className={styles.cardMeta}>Posted by {listing.lender?.name}</p>
                                        <div className={styles.rating}>
                                            {'⭐'.repeat(Math.round(listing.rating))}
                                            <span className={styles.ratingCount}>({Math.floor(Math.random() * 20) + 1})</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className={styles.viewAll}>
                        <Link href="/search" className="btn btn-outline">
                            View All Listings
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
