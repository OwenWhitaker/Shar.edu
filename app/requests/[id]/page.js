import { getRequestById } from '../../../lib/db';
import RequestDetailView from '../../../components/RequestDetailView';

export default async function RequestPage({ params }) {
    const { id } = await params;
    const request = getRequestById(id);

    if (!request) {
        return <div className="container">Request not found</div>
    }

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <RequestDetailView request={request} />
        </div>
    );
}
