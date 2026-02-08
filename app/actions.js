"use server";

import { createListing, createRequest, clearUserRequests } from '../lib/db';
import { redirect } from 'next/navigation';

export async function createListingAction(formData) {
    const title = formData.get('title');
    const description = formData.get('description');
    const image = formData.get('image') || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80'; // Default mock image
    const tags = formData.get('tags').split(',').map(t => t.trim());

    // In a real app, we'd get the user ID from the session
    // For MVP, we'll assume the client sends it or we mock it
    const lenderId = formData.get('lenderId') || 'u1';

    const newListing = createListing({
        title,
        description,
        image,
        tags,
        lenderId
    });

    redirect(`/listings/${newListing.id}`);
}

export async function createRequestAction(listingId, lenderId, borrowerId) {
    if (!borrowerId) throw new Error("Must be logged in to borrow");

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    createRequest({
        listingId,
        lenderId,
        borrowerId,
    });

    // Revalidate paths if needed, or just return success
    return { success: true };
}

export async function clearRequestsAction(userId) {
    clearUserRequests(userId);
    return { success: true };
}
