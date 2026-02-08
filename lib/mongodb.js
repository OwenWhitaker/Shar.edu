import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    console.warn('Invalid/Missing environment variable: "MONGODB_URI" - DB connection will fail at runtime');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
    // In build mode or if env var is missing, return a dummy promise that never resolves or rejects when awaited to prevent crash
    // This allows the build to complete even if DB connection is missing (common in Vercel build step)
    clientPromise = Promise.resolve(null);
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
