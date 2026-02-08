"use client";

import { useAuth } from '../app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ContactButton({ email }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const handleContact = () => {
        if (!isAuthenticated) {
            router.push('/login');
        } else {
            window.location.href = `mailto:${email}`;
        }
    };

    return (
        <button
            onClick={handleContact}
            className="btn btn-primary"
            style={{ width: '100%' }}
        >
            Contact Lender
        </button>
    );
}
