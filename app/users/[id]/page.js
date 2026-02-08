import { getUser, getListings } from '../../../lib/db';
import styles from './page.module.css';
import Link from 'next/link';

export default async function UserProfile({ params }) {
    const { id } = await params;
    const user = getUser(id);
    const allListings = getListings();
    const userListings = allListings.filter(l => l.lenderId === id);

    if (!user) {
        return <div className="container" style={{ padding: '4rem' }}>User not found</div>;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.profileHeader}>
                <div className={styles.profileContent}>
                    <div className={styles.avatarLarge}>
                        <img src={user.image} alt={user.name} className={styles.avatarImg} />
                    </div>
                    <h1 className={styles.name}>{user.name}</h1>
                    <p className={styles.major}>{user.major}</p>
                    <div className={styles.bioBox}>
                        <p className={styles.bio}>{user.bio}</p>
                    </div>
                    <div className={styles.statsRow}>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{user.rating}</span>
                            <span className={styles.statLabel}>Rating</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{userListings.length}</span>
                            <span className={styles.statLabel}>Listings</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`container ${styles.listingsContainer}`}>
                <h2 className={styles.sectionTitle}>Active Listings</h2>
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
                                    <p className={styles.cardMeta}>Posted by {listing.lender?.name}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                {userListings.length === 0 && (
                    <p className={styles.empty}>No active listings.</p>
                )}
            </div>
        </div>
    );
}
