import styles from './ListingCardSkeleton.module.css';

export default function ListingCardSkeleton() {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <div className={styles.image}></div>
            </div>
            <div className={styles.content}>
                <div className={styles.textGroup}>
                    <div className={styles.title}></div>
                    <div className={styles.meta}></div>
                </div>
                <div className={styles.badge}></div>
            </div>
        </div>
    );
}
