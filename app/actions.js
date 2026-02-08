"use server";

import { createListing } from '../lib/db';
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


export async function createRequestAction(listingId, lenderId, borrowerId, message) {
    if (!borrowerId) throw new Error("Must be logged in to borrow");

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                listingId,
                lenderId,
                borrowerId,
                message: message || '' // Include optional message
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create request');
        }

        const data = await response.json();
        return { success: true, id: data.id };
    } catch (error) {
        console.error('Error creating request:', error);
        return { success: false, error: error.message };
    }
}


export async function clearRequestsAction(userId) {
    // This function is no longer needed with MongoDB as we don't clear all requests
    // But keeping it for backwards compatibility
    return { success: true };
}
