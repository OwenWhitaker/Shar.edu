import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db("borrowit");
        const body = await request.json();

        const { uid, email, displayName, photoURL } = body;

        if (!uid) {
            return NextResponse.json({ error: 'UID is required' }, { status: 400 });
        }

        const updateDoc = {
            $set: {
                firebaseUid: uid,
                email: email,
                username: displayName || email.split('@')[0], // Fallback username
                lastLogin: new Date()
            },
            $setOnInsert: {
                createdAt: new Date(),
                numListings: 0,
                bio: "New to Shar.edu",
                major: "Undecided",
                image: photoURL
            }
        };

        const result = await db.collection("users").updateOne(
            { firebaseUid: uid },
            updateDoc,
            { upsert: true }
        );

        return NextResponse.json({ success: true, result });
    } catch (e) {
        console.error("Error syncing user:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
