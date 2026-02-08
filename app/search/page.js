import { getListings } from '../../lib/db';
import styles from './page.module.css';
import Link from 'next/link';
import HeroSearch from '../../components/HeroSearch';

export default async function SearchPage({ searchParams }) {
    const params = await searchParams;
    const query = params.q?.toLowerCase() || '';

    const allListings = getListings();

    const filteredListings = allListings.filter(item => {
        const matchesQuery = item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.tags?.some(tag => tag.toLowerCase().includes(query));

        return matchesQuery;
    });

    return (
        <div className={styles.wrapper}>
            <div className={`container ${styles.container}`}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>Search Results</h1>
                    <p className={styles.resultCount}>
                        Found {filteredListings.length} items {query && `for "${query}"`}
                    </p>
                    <div className={styles.searchBarContainer}>
                        <HeroSearch />
                    </div>
                </div>

                <div className={styles.grid}>
                    {filteredListings.map(listing => (
                        <Link href={`/listings/${listing.id}`} key={listing.id} className={styles.cardLink}>
                            <div className={styles.card}>
                                <div className={styles.cardImageContainer}>
                                    <img
                                        src={listing.image}
                                        alt={listing.title}
                                        className={styles.cardImage}
                                    />

                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{listing.title}</h3>
                                    <div className={styles.cardFooter}>
                                        <div className={styles.lenderInfo}>
                                            <span className={styles.lenderName}>by {listing.lender?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredListings.length === 0 && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <h3 className={styles.emptyTitle}>No matches found</h3>
                        <p className={styles.emptyText}>Try adjusting your search terms or browse our new arrivals.</p>
                        <Link href="/" className="btn btn-primary">
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
