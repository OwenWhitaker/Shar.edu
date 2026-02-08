import { getListingById, getListingRequests } from '../../../../lib/db';
import Modal from '../../../../components/Modal';
import ListingDetailView from '../../../../components/ListingDetailView';

export default async function ListingModal({ params }) {
    const { id } = await params;
    const listing = getListingById(id);
    const requests = getListingRequests(id);

    if (!listing) return null;

    return (
        <Modal>
            <ListingDetailView listing={listing} requestCount={requests.length} />
        </Modal>
    );
}
