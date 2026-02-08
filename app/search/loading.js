import styles from './page.module.css';
import ListingCardSkeleton from '../../components/ListingCardSkeleton';
import HeroSearch from '../../components/HeroSearch';

export default function Loading() {
    return (
        <div className={styles.wrapper}>
            <div className={`container ${styles.container}`}>
                <div className={styles.header}>
                    <div className={styles.skeletonTitle} style={{ height: '3rem', width: '300px', background: '#f0f0f0', borderRadius: '8px', marginBottom: '1rem' }}></div>
                    <div className={styles.skeletonText} style={{ height: '1.5rem', width: '200px', background: '#f0f0f0', borderRadius: '8px', marginBottom: '2rem' }}></div>
                    <div className={styles.searchBarContainer}>
                        <HeroSearch />
                    </div>
                </div>

                <div className={styles.grid}>
                    <ListingCardSkeleton />
                    <ListingCardSkeleton />
                    <ListingCardSkeleton />
                    <ListingCardSkeleton />
                    <ListingCardSkeleton />
                    <ListingCardSkeleton />
                </div>
            </div>
        </div>
    );
}
