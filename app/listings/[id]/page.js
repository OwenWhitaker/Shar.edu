import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import ListingDetailView from '../../../components/ListingDetailView';

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
                    itemDescription: 1, // field name in DB
                    description: "$itemDescription", // map to description if component expects it
                    tag: 1,
                    // tags: { $split: ["$tag", ","] }, // handled in JS to be safer
                    photo: 1,
                    photos: 1, // Include photos array
                    image: "$photo", // map photo to image
                    numRequests: 1,
                    requests: 1, // Embedded requests? Or need to fetch from requests collection?
                    // The create-listing route inits requests: [], so we can use that for now.
                    // But wait, creating a request might be in a separate collection or embedded.
                    // lib/db.js has a separate requests array.
                    // app/api/listings/route.js initializes requests: [].
                    // So we can assume embedded for now or emtpy.
                    createdAt: 1,
                    ownerUid: 1,
                    "lender.username": 1,
                    "lender.firebaseUid": 1,
                    "lender.bio": 1,
                    "lender.major": 1,
                    "lender.image": 1
                }
            }
        ]).toArray();

        if (!listings || listings.length === 0) return null;

        const listing = listings[0];

        if (listing.lender) {
            listing.lender.name = listing.lender.username;
            listing.lender.id = listing.lender.firebaseUid;
            listing.lender.image = listing.lender.image; // Explicit assignment
        }

        // Ensure tags is an array
        if (!listing.tags && listing.tag) {
            listing.tags = listing.tag.split(',').map(t => t.trim());
        } else if (!listing.tags) {
            listing.tags = [];
        }

        // Map photos to images array
        console.log(`[getListing] Fetched listing ${id}. Photos:`, listing.photos ? listing.photos.length : 'N/A', "Photo:", listing.photo ? 'Yes' : 'No');
        listing.images = listing.photos || (listing.photo ? [listing.photo] : []);
        console.log(`[getListing] Mapped images:`, listing.images.length);

        return listing;
    } catch (e) {
        console.error("Error fetching listing:", e);
        return null;
    }
}

export default async function ListingDetail({ params }) {
    const { id } = await params;
    const listing = await getListing(id);

    if (!listing) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Listing not found</h2>
                <p>The item you are looking for does not exist or has been removed.</p>
            </div>
        );
    }

    // Requests are currently embedded or we might need to fetch them if we move to separate collection.
    // For now, let's pass the listing.requests if it exists, or empty array.
    const requests = listing.requests || [];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            <ListingDetailView listing={listing} requests={requests} requestCount={requests.length} />
        </div>
    );
}
