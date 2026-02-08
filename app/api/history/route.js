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

        // In a real app, we'd have a 'trades' collection or requests with 'completed' status.
        // For now, let's look for requests that are 'accepted' or 'completed' in the listings.
        // Or if we moved to a requests collection, we'd search there.

        // Let's assume for now we are fetching from a 'trades' collection that might have been created.
        // If it doesn't exist, we'll return an empty array.

        const trades = await db.collection("trades")
            .find({ $or: [{ borrowerId: userId }, { lenderId: userId }] })
            .sort({ completedAt: -1 })
            .toArray();

        return NextResponse.json(trades);
    } catch (e) {
        console.error("Error fetching history:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
