import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const client = await clientPromise;
        const db = client.db("borrowit");

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid request ID' }, { status: 400 });
        }

        const requestData = await db.collection("requests").aggregate([
            { $match: { _id: new ObjectId(id) } },
            {
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
                    "lender.id": "$lender.firebaseUid",
                    "lender.name": "$lender.username",
                    "lender.image": 1
                }
            }
        ]).toArray();

        if (!requestData || requestData.length === 0) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        return NextResponse.json(requestData[0]);
    } catch (e) {
        console.error("Error fetching request:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    const { id } = await params;

    try {
        const client = await clientPromise;
        const db = client.db("borrowit");
        const body = await request.json();

        const { status } = body;

        if (!status || !['pending', 'accepted', 'declined'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be pending, accepted, or declined' },
                { status: 400 }
            );
        }

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid request ID' }, { status: 400 });
        }

        const result = await db.collection("requests").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    status: status,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, status });
    } catch (e) {
        console.error("Error updating request:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
