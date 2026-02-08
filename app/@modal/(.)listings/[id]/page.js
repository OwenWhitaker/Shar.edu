import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import Modal from '../../../../components/Modal';
import ListingDetailView from '../../../../components/ListingDetailView';

async function getListing(id) {
    try {
        const client = await clientPromise;
        const db = client.db("borrowit");

        if (!ObjectId.isValid(id)) return null;

        const listings = await db.collection("listings").aggregate([
            { $match: { _id: new ObjectId(id) } },
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
                    itemDescription: 1,
                    description: "$itemDescription",
                    tag: 1,
                    // tags: { $split: ["$tag", ","] },
                    photo: 1,
                    image: "$photo",
                    numRequests: 1,
                    requests: 1,
                    createdAt: 1,
                    ownerUid: 1,
                    "lender.username": 1,
                    "lender.firebaseUid": 1,
                    "lender.bio": 1,
                    "lender.major": 1
                }
            }
        ]).toArray();

        if (!listings || listings.length === 0) return null;

        const listing = listings[0];

        if (listing.lender) {
            listing.lender.name = listing.lender.username;
            listing.lender.id = listing.lender.firebaseUid;
        }

        // Ensure tags is an array
        if (!listing.tags && listing.tag) {
            listing.tags = listing.tag.split(',').map(t => t.trim());
        } else if (!listing.tags) {
            listing.tags = [];
        }

        return listing;
    } catch (e) {
        console.error("Error fetching listing for modal:", e);
        return null;
    }
}

export default async function ListingModal({ params }) {
    const { id } = await params;
    const listing = await getListing(id);

    if (!listing) return null;

    // Mock requests for now or fetch if needed
    const requests = listing.requests || [];

    return (
        <Modal>
            <ListingDetailView listing={listing} requests={requests} requestCount={requests.length} />
        </Modal>
    );
}
