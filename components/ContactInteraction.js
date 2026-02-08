"use client";

import { useState } from 'react';
import styles from './ContactInteraction.module.css';
import ContactModal from './ContactModal';

export default function ContactInteraction({ lenderEmail, listingTitle, buttonLabel = "Contact Lender" }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                className={styles.outlineButton}
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
