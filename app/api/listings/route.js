import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const client = await clientPromise.catch(err => {
            console.error("Database connection failed:", err);
            return null;
        });

        if (!client) {
            return NextResponse.json({ error: 'Database connection failed. Check MONGODB_URI.' }, { status: 503 });
        }

        const db = client.db("borrowit");

        const listings = await db.collection("listings")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        // Map listings to handle "lender" field (need to join users? No, prompt mentions "ownerUid" but page.js displays "lender.name".)
        // Prompt says: "Users Collection: firebaseUid, username, bio, major, description, numListings."
        // "Listings Collection: ownerUid, etc"
        // Page.js expects `lender.name`.
        // I should probably fetch users too or do a join to populate `lender`.
        // Given complexity, and typical NoSQL, fetching users for listings or doing lookup is needed.
        // Let's do a simple $lookup to populate lender info.

        // However, standard join in MongoDB aggregate:
        // {
        //   $lookup: {
        //     from: "users",
        //     localField: "ownerUid",
        //     foreignField: "firebaseUid",
        //     as: "lender"
        //   }
        // }
        // Let's use aggregation.

        const listingsWithLender = await db.collection("listings").aggregate([
            { $sort: { createdAt: -1 } },
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
                    _id: 0, // Or convert to string if needed by client but page.js uses listing.id
                    id: { $toString: "$_id" },
                    title: 1,
                    itemDescription: 1,
                    tag: 1,
                    photo: 1,
                    photos: 1, // Include new field
                    numRequests: 1,
                    requests: 1,
                    createdAt: 1,
                    ownerUid: 1,
                    "lender.username": 1, // Map username to name for display
                    "lender.firebaseUid": 1
                }
            }
        ]).toArray();

        // The frontend expects `lender.name`, but our user schema has `username`. I will map it in the projection or frontend.
        // Let's map it here to be safe: lender: { name: "$lender.username", ... }

        const finallistings = listingsWithLender.map(l => ({
            ...l,
            image: l.photos ? l.photos[0] : l.photo, // frontend uses .image for cover
            images: l.photos ? l.photos : (l.photo ? [l.photo] : []), // Array of images
            lender: l.lender ? { ...l.lender, name: l.lender.username } : null
        }));

        return NextResponse.json(finallistings);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        console.log("Connecting to MongoDB... URI present?", !!process.env.MONGODB_URI);
        const client = await clientPromise.catch(err => {
            console.error("Database connection failed:", err);
            return null;
        });

        if (!client) {
            return NextResponse.json({ error: 'Database connection failed. Check MONGODB_URI.' }, { status: 503 });
        }

        const db = client.db("borrowit");
        const body = await request.json();

        const { ownerUid, title, itemDescription, tag, photos } = body;

        console.log("Creating listing. Photos received:", photos ? photos.length : 0);
        if (photos && photos.length > 0) {
            console.log("First photo length:", photos[0].length);
        }

        // Validation? Prompt implies just insert.

        const newListing = {
            ownerUid,
            title,
            itemDescription,
            tag,
            photos, // Store array of base64 strings
            numRequests: 0,
            requests: [],
            createdAt: new Date(),
        };

        const result = await db.collection("listings").insertOne(newListing);

        // Also update user's numListings?
        await db.collection("users").updateOne(
            { firebaseUid: ownerUid },
            { $inc: { numListings: 1 } }
        );

        return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
