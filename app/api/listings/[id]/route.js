import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid listing ID' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("borrowit");

        const result = await db.collection("listings").deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 1) {
            return NextResponse.json({ message: 'Listing deleted successfully' });
        } else {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
        }
    } catch (e) {
        console.error("Error deleting listing:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
