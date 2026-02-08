import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { id } = await params; // await params in Next.js 15+

    try {
        const client = await clientPromise;
        const db = client.db("borrowit");

        const user = await db.collection("users").findOne({ firebaseUid: id });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    const { id } = await params;

    try {
        const client = await clientPromise;
        const db = client.db("borrowit");
        const body = await request.json();

        const { bio, major, description, firstName, lastName, image } = body;

        const updateData = {};
        if (bio !== undefined) updateData.bio = bio;
        if (major !== undefined) updateData.major = major;
        if (description !== undefined) updateData.description = description;
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (firstName && lastName) updateData.name = `${firstName} ${lastName}`;
        if (image !== undefined) updateData.image = image;

        const result = await db.collection("users").updateOne(
            { firebaseUid: id },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    const { id } = await params;

    try {
        const client = await clientPromise;
        const db = client.db("borrowit");
        const body = await request.json();

        const { username, bio, major, description, email } = body;

        // Check if user already exists to avoid duplicates or errors (though insertOne might error on unique index if set)
        const existingUser = await db.collection("users").findOne({ firebaseUid: id });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const newUser = {
            firebaseUid: id,
            username: username || email?.split('@')[0] || 'User',
            bio: bio || '',
            major: major || '',
            description: description || '',
            numListings: 0,
            createdAt: new Date()
        };

        const result = await db.collection("users").insertOne(newUser);

        return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
