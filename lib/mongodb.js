import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    console.warn('Invalid/Missing environment variable: "MONGODB_URI" - DB connection will fail at runtime');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
    // In build mode, return a dummy promise to allow build to pass.
    // In runtime (dev/prod), if URI is missing, we should probably fail or log heavily.
    if (process.env.NODE_ENV === 'production') {
        clientPromise = Promise.resolve(null);
    } else {
        // In dev, create a promise that rejects to make the error obvious
        clientPromise = Promise.reject(new Error("Missing MONGODB_URI environment variable"));
    }
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
