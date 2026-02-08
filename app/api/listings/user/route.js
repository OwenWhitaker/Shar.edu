import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const client = await clientPromise;
        if (!client) {
            return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
        }

        const db = client.db("borrowit");

        const listings = await db.collection("listings")
            .find({ ownerUid: userId })
            .sort({ createdAt: -1 })
            .toArray();

        // Map for frontend
        const formattedListings = listings.map(l => ({
            ...l,
            id: l._id.toString(),
            image: l.photos ? l.photos[0] : l.photo,
        }));

        return NextResponse.json(formattedListings);
    } catch (e) {
        console.error("Error fetching user listings:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
