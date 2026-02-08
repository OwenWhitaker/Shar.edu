import Modal from '../../../../components/Modal';
import styles from '../../../../components/Skeleton.module.css';
import viewStyles from '../../../../components/ListingDetailView.module.css';

export default function Loading() {
    return (
        <Modal>
            <div className={viewStyles.container} style={{ boxShadow: 'none', width: '100%' }}>
                <div className={styles.container}>
                    <div>
                        <div className={`${styles.skeleton} ${styles.image}`} style={{ aspectRatio: '1', borderRadius: '40px' }}></div>
                    </div>
                    <div>
                        <div className={`${styles.skeleton} ${styles.title}`}></div>
                        <div className={`${styles.skeleton} ${styles.meta}`}></div>
                        <div className={`${styles.skeleton} ${styles.lender}`}></div>
                        <div className={`${styles.skeleton} ${styles.button}`}></div>
                        <div style={{ marginTop: '2rem' }}>
                            <div className={`${styles.skeleton} ${styles.textLine}`}></div>
                            <div className={`${styles.skeleton} ${styles.textLine}`}></div>
                            <div className={`${styles.skeleton} ${styles.textLine}`} style={{ width: '60%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
