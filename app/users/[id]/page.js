import clientPromise from '@/lib/mongodb';
import styles from './page.module.css';
import Link from 'next/link';
import StarRating from '../../../components/StarRating';

async function getUser(id) {
    try {
        const client = await clientPromise;
        const db = client.db("borrowit");

        const user = await db.collection("users").findOne({ firebaseUid: id });

        if (!user) return null;

        // Map MongoDB fields to expected format
        return {
            id: user.firebaseUid,
            name: user.username || user.name,
            email: user.email,
            image: user.image,
            major: user.major || 'Undecided',
            bio: user.bio || 'No bio yet',
            rating: user.rating || 0,
            numListings: user.numListings || 0
        };
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

async function getUserListings(userId) {
    try {
        const client = await clientPromise;
        const db = client.db("borrowit");

        const listings = await db.collection("listings").aggregate([
            { $match: { ownerUid: userId } },
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
                    image: "$photo",
                    itemDescription: 1,
                    "lender.name": "$lender.username"
                }
            }
        ]).toArray();

        return listings;
    } catch (error) {
        console.error("Error fetching user listings:", error);
        return [];
    }
}

export default async function UserProfile({ params }) {
    const { id } = await params;
    const user = await getUser(id);
    const userListings = await getUserListings(id);

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
                    <p className={styles.major}>Major: {user.major}</p>
                    <div className={styles.bioBox}>
                        <p className={styles.bio}>{user.bio}</p>
                    </div>
                    <div className={styles.statsRow}>
                        <div className={styles.stat}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                <span className={styles.statValue}>
                                    {user.rating > 0 ? `${user.rating}/5` : 'No ratings yet'}
                                </span>
                                {user.rating > 0 && <StarRating rating={user.rating} />}
                            </div>
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
