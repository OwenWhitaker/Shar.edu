import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit')) || 20;
        const page = parseInt(searchParams.get('page')) || 1;
        const skip = (page - 1) * limit;

        const client = await clientPromise.catch(err => {
            console.error("Database connection failed:", err);
            return null;
        });

        if (!client) {
            return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
        }

        const db = client.db("borrowit");

        // Use aggregation for optimized join and projection
        const listingsWithLender = await db.collection("listings").aggregate([
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
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
                    id: { $toString: "$_id" },
                    title: 1,
                    itemDescription: 1,
                    tag: 1,
                    photo: 1, // Store cover photo (first one usually)
                    // Do NOT project the full 'photos' array here to keep response size small
                    numRequests: 1,
                    createdAt: 1,
                    ownerUid: 1,
                    "lender.username": 1,
                    "lender.firebaseUid": 1,
                    "lender.image": 1,
                    // If we need the count of photos without the actual data:
                    photosCount: { $size: { $ifNull: ["$photos", []] } }
                }
            }
        ]).toArray();

        const finallistings = listingsWithLender.map(l => ({
            ...l,
            // Fallback for image field used by frontend components
            image: l.photo || (l.photosCount > 0 ? "/images/placeholder.png" : null),
            lender: l.lender ? {
                ...l.lender,
                name: l.lender.username,
                id: l.lender.firebaseUid,
            } : null
        }));

        return NextResponse.json(finallistings);
    } catch (e) {
        console.error("Error in GET /api/listings:", e);
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
