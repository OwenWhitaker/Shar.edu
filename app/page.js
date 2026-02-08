import Link from 'next/link';
import { getListings } from '../lib/db';
import styles from './page.module.css';
import HeroClouds from '../components/HeroClouds';
import HeroSearch from '../components/HeroSearch';

import FeaturedListings from '../components/FeaturedListings';

export default function Home() {
    const listings = getListings();

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
                        <h2 className={styles.sectionTitle}>New Arrivals</h2>
                        <Link href="/search" className={styles.viewAllLink}>
                            View All <span className={styles.arrow}>→</span>
                        </Link>
                    </div>

                    <FeaturedListings listings={listings} />
                </div>
            </section>
        </div>
    );
}
