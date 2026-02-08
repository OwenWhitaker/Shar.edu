import { getRequestsForUser, getUser } from '../../lib/db';
import RequestCard from '../../components/RequestCard';
import styles from './page.module.css';

export default function RequestsPage({ searchParams }) {
    // In a real app we'd get the user from the session
    // For MVP, we'll hardcode 'u1' (Owen) unless specified
    const userId = 'u1';
    const { incoming, outgoing } = getRequestsForUser(userId);

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Requests</h1>

            <div className={styles.grid}>
                <div className={styles.column}>
                    <h2 className={styles.columnTitle}>Incoming Requests ({incoming.length})</h2>
                    <div className={styles.list}>
                        {incoming.length === 0 ? (
                            <p className={styles.empty}>No incoming requests.</p>
                        ) : (
                            incoming.map(req => (
                                <RequestCard key={req.id} request={req} type="incoming" />
                            ))
                        )}
                    </div>
                </div>

                <div className={styles.column}>
                    <h2 className={styles.columnTitle}>Sent Requests ({outgoing.length})</h2>
                    <div className={styles.list}>
                        {outgoing.length === 0 ? (
                            <p className={styles.empty}>No requests sent.</p>
                        ) : (
                            outgoing.map(req => (
                                <RequestCard key={req.id} request={req} type="outgoing" />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
