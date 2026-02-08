import clientPromise from '@/lib/mongodb';
import styles from './page.module.css';
import Link from 'next/link';
import HeroSearch from '../../components/HeroSearch';

export default async function SearchPage({ searchParams }) {
    const params = await searchParams;
    const query = params.q || '';

    let filteredListings = [];

    try {
        const client = await clientPromise;
        const db = client.db("borrowit");

        const regex = new RegExp(query, 'i'); // Case-insensitive regex

        const pipeline = [
            {
                $match: {
                    $or: [
                        { title: { $regex: regex } },
                        { itemDescription: { $regex: regex } }, // Note: itemDescription field
                        { tag: { $regex: regex } }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "ownerUid",
                    foreignField: "firebaseUid",
                    as: "lender"
                }
            },
            {
                $unwind: {
                    path: "$lender",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    id: { $toString: "$_id" },
                    title: 1,
                    itemDescription: 1,
                    description: "$itemDescription",
                    tag: 1,
                    image: "$photo",
                    createdAt: 1,
                    "lender.name": "$lender.username", // Map username to name
                    "lender.username": 1,
                    "lender.image": 1
                }
            }
        ];

        filteredListings = await db.collection("listings").aggregate(pipeline).toArray();

    } catch (e) {
        console.error("Search error:", e);
        // Fallback to empty or error state
    }

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
                                            <div className={styles.lenderBadgeSmall}>
                                                {listing.lender?.image ? (
                                                    <img src={listing.lender.image} alt={listing.lender.name} className={styles.lenderImg} />
                                                ) : (
                                                    listing.lender?.name?.[0] || 'U'
                                                )}
                                            </div>
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
