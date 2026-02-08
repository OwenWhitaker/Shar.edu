/* eslint-disable react/no-unescaped-entities */
import { getRequestsForUser } from '../../lib/db';
import RequestCard from '../../components/RequestCard';
import styles from './page.module.css';

export default function RequestsPage() {
    // Hardcoded for MVP
    const userId = 'u1';
    const { incoming, outgoing } = getRequestsForUser(userId);

    return (
        <div className={styles.wrapper}>
            <div className={`container ${styles.container}`}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>Dashboard</h1>
                    <p className={styles.subtitle}>Manage your incoming and outgoing items.</p>
                </div>

                <div className={styles.grid}>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Incoming Requests</h2>
                            <span className={styles.badge}>{incoming.length}</span>
                        </div>
                        <div className={styles.cardList}>
                            {incoming.length === 0 ? (
                                <div className={styles.emptyCard}>
                                    <p>No incoming requests yet.</p>
                                </div>
                            ) : (
                                incoming.map(req => (
                                    <RequestCard key={req.id} request={req} type="incoming" />
                                ))
                            )}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Sent Requests</h2>
                            <span className={`${styles.badge} ${styles.badgeSecondary}`}>{outgoing.length}</span>
                        </div>
                        <div className={styles.cardList}>
                            {outgoing.length === 0 ? (
                                <div className={styles.emptyCard}>
                                    <p>You haven&apos;t requested anything.</p>
                                </div>
                            ) : (
                                outgoing.map(req => (
                                    <RequestCard key={req.id} request={req} type="outgoing" />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
