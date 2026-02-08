import { getListings } from '../../lib/db';
import styles from './page.module.css';
import Link from 'next/link';

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
                                    <div className={styles.cardOverlay}>
                                        <span className={styles.priceTag}>{listing.price || 'Free'}</span>
                                    </div>
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
                        <div className={styles.emptyIcon}>🔍</div>
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
