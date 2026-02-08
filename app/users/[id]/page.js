import { getUser, getListings } from '../../../lib/db';
import styles from './page.module.css';
import Link from 'next/link';
import ContactInteraction from '../../../components/ContactInteraction';

export default async function UserProfile({ params }) {
    const { id } = await params;
    const user = getUser(id);
    const allListings = getListings();
    const userListings = allListings.filter(l => l.lenderId === id);

    if (!user) {
        return <div className="container">User not found</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.profileHeader}>
                <div className={styles.avatarLarge}>
                    <img src={user.image} alt={user.name} className={styles.avatarImg} />
                </div>
                <div className={styles.profileInfo}>
                    <h1 className={styles.name}>{user.name}</h1>
                    <p className={styles.major}>{user.major}</p>
                    <p className={styles.email}>{user.email}</p>
                    <div className={styles.rating}>
                        <span>⭐ {user.rating}</span>
                        <span className={styles.reviewCount}>(Based on 12 reviews)</span>
                    </div>
                    <p className={styles.bio}>{user.bio}</p>

                    <ContactInteraction
                        lenderEmail={user.email}
                        buttonLabel="Contact Student"
                    />
                </div>
            </div>

            <div className={styles.listingsSection}>
                <h2 className={styles.sectionTitle}>Active Listings ({userListings.length})</h2>
                <div className={styles.grid}>
                    {userListings.map(listing => (
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
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                {userListings.length === 0 && (
                    <p className={styles.empty}>No active listings.</p>
                )}
            </div>

            <div className={styles.reviewsSection}>
                <h2 className={styles.sectionTitle}>Recent Reviews</h2>
                <div className={styles.reviewsList}>
                    {/* Mock Reviews */}
                    <div className={styles.reviewCard}>
                        <div className={styles.reviewHeader}>
                            <span className={styles.reviewerName}>Sarah Chen</span>
                            <span className={styles.reviewDate}>Oct 15, 2023</span>
                        </div>
                        <div className={styles.reviewRating}>⭐⭐⭐⭐⭐</div>
                        <p className={styles.reviewText}>Great lender! The camera was in perfect condition.</p>
                    </div>
                    <div className={styles.reviewCard}>
                        <div className={styles.reviewHeader}>
                            <span className={styles.reviewerName}>Mike Ross</span>
                            <span className={styles.reviewDate}>Sep 28, 2023</span>
                        </div>
                        <div className={styles.reviewRating}>⭐⭐⭐⭐⭐</div>
                        <p className={styles.reviewText}>Super helpful and flexible with pickup times.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
