import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'lib/data.json');

export function getData() {
    try {
        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Error reading data file:", error);
        return { users: [], listings: [], reviews: [], requests: [] };
    }
}

export function saveData(data) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error("Error writing data file:", error);
        return false;
    }
}

export function getListings() {
    const data = getData();
    // Join lender info
    return data.listings.map(listing => {
        const lender = data.users.find(u => u.id === listing.lenderId);
        return { ...listing, lender };
    });
}

export function getListingById(id) {
    const listings = getListings();
    return listings.find(l => l.id === id);
}

export function createListing(listingData) {
    const data = getData();
    const newListing = {
        id: `l${Date.now()}`,
        createdAt: new Date().toISOString(),
        rating: 0,
        ...listingData
    };
    data.listings.push(newListing);
    saveData(data);
    return newListing;
}

export function getUser(id) {
    const data = getData();
    return data.users.find(u => u.id === id);
}

export function createRequest(requestData) {
    const data = getData();
    const newRequest = {
        id: `r${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
        ...requestData
    };

    // Check for duplicates
    const existing = data.requests?.find(r =>
        r.listingId === requestData.listingId &&
        r.borrowerId === requestData.borrowerId
    );
    if (existing) throw new Error("Request already exists");

    // Ensure requests array exists
    if (!data.requests) data.requests = [];

    data.requests.push(newRequest);
    saveData(data);
    return newRequest;
}

export function getRequestsForUser(userId) {
    const data = getData();
    if (!data.requests) return { incoming: [], outgoing: [] };

    // Enrich requests with listing and user info
    const enrichedRequests = data.requests.map(r => {
        const listing = data.listings.find(l => l.id === r.listingId);
        const borrower = data.users.find(u => u.id === r.borrowerId);
        const lender = data.users.find(u => u.id === r.lenderId);
        return { ...r, listing, borrower, lender };
    });

    const incoming = enrichedRequests.filter(r => r.lenderId === userId);
    const outgoing = enrichedRequests.filter(r => r.borrowerId === userId);

    return { incoming, outgoing };
}

export function updateRequestStatus(requestId, status) {
    const data = getData();
    if (!data.requests) return null;

    const requestIndex = data.requests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) return null;

    data.requests[requestIndex].status = status;
    saveData(data);
    return data.requests[requestIndex];
}

export function getListingRequests(listingId) {
    const data = getData();
    if (!data.requests) return [];
    return data.requests.filter(r => r.listingId === listingId);
}

export function clearUserRequests(userId) {
    const data = getData();
    if (!data.requests) return;

    // Remove requests where user is borrower OR lender
    data.requests = data.requests.filter(r => r.borrowerId !== userId && r.lenderId !== userId);
    saveData(data);
}

export function getRequestById(id) {
    const data = getData();
    if (!data.requests) return null;

    const request = data.requests.find(r => r.id === id);
    if (!request) return null;

    const listing = data.listings.find(l => l.id === request.listingId);
    const borrower = data.users.find(u => u.id === request.borrowerId);
    const lender = data.users.find(u => u.id === request.lenderId);

    return { ...request, listing, borrower, lender };
}
