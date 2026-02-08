const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Extract MONGODB_URI from .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/MONGODB_URI=(.*)/);
const uri = match ? match[1].trim() : null;

if (!uri) {
    console.error('Error: MONGODB_URI not found in .env.local');
    process.exit(1);
}

const currentUserId = '1vaahFK61Ka7L6ZjN9XIG5ARYU52'; // From logs

async function seed() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('borrowit');

        // 1. Create a fake user
        const fakeUser = {
            firebaseUid: 'fake-user-id-999',
            username: 'TestBot',
            email: 'bot@shar.edu',
            bio: 'I am a fake user for testing history.',
            major: 'Computer Science',
            numListings: 1,
            createdAt: new Date()
        };

        await db.collection('users').updateOne(
            { firebaseUid: fakeUser.firebaseUid },
            { $set: fakeUser },
            { upside: true }
        );
        console.log('Fake user created/updated.');

        // 2. Create some trade history records
        const trades = [
            {
                borrowerId: currentUserId,
                lenderId: fakeUser.firebaseUid,
                itemTitle: 'Scientific Calculator',
                itemImage: 'https://images.unsplash.com/photo-1544383177-33a30c5e751a?q=80&w=800&auto=format&fit=crop',
                otherPartyName: fakeUser.username,
                completedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
                status: 'completed'
            },
            {
                borrowerId: fakeUser.firebaseUid,
                lenderId: currentUserId,
                itemTitle: 'Blue Yeti Microphone',
                itemImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop',
                otherPartyName: fakeUser.username,
                completedAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
                status: 'completed'
            }
        ];

        // Clear old test trades for this user pair if they exist
        await db.collection('trades').deleteMany({
            $or: [
                { borrowerId: currentUserId, lenderId: fakeUser.firebaseUid },
                { borrowerId: fakeUser.firebaseUid, lenderId: currentUserId }
            ]
        });

        await db.collection('trades').insertMany(trades);
        console.log(`Inserted ${trades.length} trade records for user: ${currentUserId}`);

    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await client.close();
    }
}

seed();
