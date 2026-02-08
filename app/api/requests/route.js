import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("borrowit");

        // Fetch all requests where user is either borrower or lender
        const requests = await db.collection("requests").aggregate([
            {
                $match: {
                    $or: [
                        { borrowerId: userId },
                        { lenderId: userId }
                    ]
                }
            },
            {
                // Lookup listing details
                $lookup: {
                    from: "listings",
                    localField: "listingId",
                    foreignField: "_id",
                    as: "listing"
                }
            },
            {
                $unwind: {
                    path: "$listing",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                // Lookup borrower details
                $lookup: {
                    from: "users",
                    localField: "borrowerId",
                    foreignField: "firebaseUid",
                    as: "borrower"
                }
            },
            {
                $unwind: {
                    path: "$borrower",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                // Lookup lender details
                $lookup: {
                    from: "users",
                    localField: "lenderId",
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
                    listingId: { $toString: "$listingId" },
                    borrowerId: 1,
                    lenderId: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "listing.id": { $toString: "$listing._id" },
                    "listing.title": 1,
                    "listing.image": "$listing.photo",
                    "listing.itemDescription": 1,
                    "borrower.id": "$borrower.firebaseUid",
                    "borrower.name": "$borrower.username",
                    "borrower.image": 1,
                    "borrower.rating": 1,
                    "borrower.bio": 1,
                    "lender.id": "$lender.firebaseUid",
                    "lender.name": "$lender.username",
                    "lender.image": 1
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]).toArray();

        // Split into incoming and outgoing
        const incoming = requests.filter(r => r.lenderId === userId);
        const outgoing = requests.filter(r => r.borrowerId === userId);

        return NextResponse.json({ incoming, outgoing });
    } catch (e) {
        console.error("Error fetching requests:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db("borrowit");
        const body = await request.json();

        const { listingId, borrowerId, lenderId, message } = body;

        if (!listingId || !borrowerId || !lenderId) {
            return NextResponse.json(
                { error: 'listingId, borrowerId, and lenderId are required' },
                { status: 400 }
            );
        }

        // Check for duplicate requests
        const existingRequest = await db.collection("requests").findOne({
            listingId: new ObjectId(listingId),
            borrowerId: borrowerId,
            status: 'pending'
        });

        if (existingRequest) {
            return NextResponse.json(
                { error: 'Request already exists' },
                { status: 409 }
            );
        }

        // Create new request
        const newRequest = {
            listingId: new ObjectId(listingId),
            borrowerId,
            lenderId,
            status: 'pending',
            message: message || '', // Optional message from borrower
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection("requests").insertOne(newRequest);

        // Update listing's numRequests
        await db.collection("listings").updateOne(
            { _id: new ObjectId(listingId) },
            {
                $inc: { numRequests: 1 },
                $push: { requests: result.insertedId }
            }
        );

        return NextResponse.json({
            success: true,
            id: result.insertedId.toString()
        }, { status: 201 });
    } catch (e) {
        console.error("Error creating request:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
