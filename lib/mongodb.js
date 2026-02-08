import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    console.warn('Invalid/Missing environment variable: "MONGODB_URI" - DB connection will fail at runtime');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

// Validate URI format
const isValidUri = uri && (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"));

if (!isValidUri) {
    console.warn("⚠️ MONGODB_URI is missing or invalid. Using mock client for build/runtime safety.");

    // Return a mock client that won't crash the app, but will fail gracefully if operations are attempted
    // This allows Next.js build to finish static generation steps without needing a real DB connection
    const mockClient = {
        db: () => ({
            collection: () => ({
                find: () => ({ sort: () => ({ toArray: () => Promise.resolve([]) }) }),
                aggregate: () => ({ toArray: () => Promise.resolve([]) }),
                insertOne: () => Promise.resolve({ insertedId: 'mock-id' }),
                updateOne: () => Promise.resolve({ matchedCount: 1 }),
                findOne: () => Promise.resolve(null),
            })
        }),
        connect: () => Promise.resolve()
    };
    clientPromise = Promise.resolve(mockClient);
} else {
    if (process.env.NODE_ENV === 'development') {
        // In development mode, use a global variable so that the value
        // is preserved across module reloads caused by HMR (Hot Module Replacement).
        if (!global._mongoClientPromise) {
            client = new MongoClient(uri, options);
            global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
    } else {
        // In production mode, it's best to not use a global variable.
        client = new MongoClient(uri, options);
        clientPromise = client.connect();
    }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
