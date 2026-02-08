const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/MONGODB_URI=(.*)/);
const uri = match ? match[1].trim() : null;

async function run() {
    if (!uri) { console.error('No URI'); return; }
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('borrowit');
        const res = await db.collection('trades').deleteMany({});
        console.log('History cleared. Deleted:', res.deletedCount, 'records.');
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
run();
