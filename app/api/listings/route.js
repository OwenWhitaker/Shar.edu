import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limitStr = searchParams.get('limit');
        const pageStr = searchParams.get('page');

        const limit = limitStr ? parseInt(limitStr, 10) : 50; // Default to 50
        const page = pageStr ? parseInt(pageStr, 10) : 1;
        const skip = (page - 1) * limit;

        const client = await clientPromise.catch(err => {
            console.error("Database connection failed:", err);
            return null;
        });

        if (!client) {
            return NextResponse.json({ error: 'Database connection failed. Check MONGODB_URI.' }, { status: 503 });
        }

        const db = client.db("borrowit");

        // Use aggregation for efficient join and pagination
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
                    _id: 0, // Or convert to string if needed by client but page.js uses listing.id
                    id: { $toString: "$_id" },
                    title: 1,
                    itemDescription: 1,
                    tag: 1,
                    photo: 1,
                    photos: { $slice: ["$photos", 1] }, // Optimize: Only fetch the first photo for the card view
                    numRequests: 1,
                    requests: 1,
                    createdAt: 1,
                    ownerUid: 1,
                    "lender.username": 1, // Map username to name for display
                    "lender.firebaseUid": 1,
                    "lender.image": 1
                }
            }
        ]).toArray();

        // The frontend expects `lender.name`, but our user schema has `username`. I will map it in the projection or frontend.
        // Let's map it here to be safe: lender: { name: "$lender.username", ... }

        const finallistings = listingsWithLender.map(l => ({
            ...l,
            image: l.photos && l.photos.length > 0 ? l.photos[0] : l.photo, // frontend uses .image for cover
            images: l.photos && l.photos.length > 0 ? l.photos : (l.photo ? [l.photo] : []), // Array of images
            lender: l.lender ? {
                ...l.lender,
                name: l.lender.username,
                id: l.lender.firebaseUid,
                image: l.lender.image
            } : null
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
