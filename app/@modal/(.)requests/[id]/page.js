import { getRequestById } from '../../../../lib/db';
import Modal from '../../../../components/Modal';
import RequestDetailView from '../../../../components/RequestDetailView';

export default async function RequestModal({ params }) {
    const { id } = await params;
    const request = getRequestById(id);

    if (!request) return null;

    return (
        <Modal>
            <RequestDetailView request={request} />
        </Modal>
    );
}
