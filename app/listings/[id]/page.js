import { getListingById, getListingRequests } from '../../../lib/db';
import ListingDetailView from '../../../components/ListingDetailView';

export default async function ListingDetail({ params }) {
    const { id } = await params;
    const listing = getListingById(id);
    const requests = getListingRequests(id);

    if (!listing) {
        return <div className="container">Listing not found</div>
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            <ListingDetailView listing={listing} requestCount={requests.length} />
        </div>
    );

}
