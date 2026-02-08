import { getListings } from '../../lib/db';
import styles from './page.module.css';
import Link from 'next/link';

export default function SearchPage({ searchParams }) {
    const query = searchParams.q?.toLowerCase() || '';

    const allListings = getListings();

    const filteredListings = allListings.filter(item => {
        const matchesQuery = item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.tags?.some(tag => tag.toLowerCase().includes(query));

        return matchesQuery;
    });

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <h3>Filters</h3>
                <div className={styles.filterGroup}>
                    <p className={styles.empty}>No filters available.</p>
                </div>
            </div>

            <div className={styles.results}>
                <h2>{filteredListings.length} results {query && `for "${query}"`}</h2>

                <div className={styles.grid}>
                    {filteredListings.map(listing => (
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

                {filteredListings.length === 0 && (
                    <div className={styles.empty}>
                        <p>No listings found. Try adjusting your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
