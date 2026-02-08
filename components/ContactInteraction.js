"use client";

import { useState } from 'react';
import ContactModal from './ContactModal';

export default function ContactInteraction({ lenderEmail, listingTitle, buttonLabel = "Contact Lender" }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => setIsModalOpen(true)}
            >
                {buttonLabel}
            </button>

            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                lenderEmail={lenderEmail}
                listingTitle={listingTitle}
            />
        </>
    );
}
