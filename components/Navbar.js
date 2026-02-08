"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import { clearRequestsAction } from '../app/actions';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleCreateClick = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            router.push('/login?returnUrl=/create');
        }
    };

    const handleClearRequests = async () => {
        if (confirm('DEV: Are you sure you want to clear ALL your requests (incoming and outgoing)?')) {
            await clearRequestsAction(user.id);
            alert('Requests cleared!');
            router.refresh();
        }
    };

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    Borrow<span className={styles.logoAccent}>It</span>
                </Link>

                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search for textbooks, electronics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className={styles.searchInput}
                    />
                    <button className={styles.searchButton} onClick={handleSearch}>
                        🔍
                    </button>
                </div>

                <div className={styles.navActions}>
                    {isAuthenticated && (
                        <button
                            onClick={handleClearRequests}
                            style={{
                                background: '#333', color: '#fff', border: 'none',
                                padding: '0.25rem 0.5rem', borderRadius: '4px',
                                fontSize: '0.7rem', cursor: 'pointer', marginRight: '1rem'
                            }}
                        >
                            DEV: Clear
                        </button>
                    )}
                    <Link href="/create" className="btn btn-primary" onClick={handleCreateClick}>
                        + Create Listing
                    </Link>

                    {isAuthenticated && (
                        <Link href="/requests" className={styles.navLink}>
                            Requests
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <Link href="/profile" className={styles.profileLink}>
                            <div className={styles.avatar}>
                                {user?.image ? (
                                    <img src={user.image} alt={user.name} className={styles.avatarImg} />
                                ) : (
                                    user?.name?.[0] || 'U'
                                )}
                            </div>
                        </Link>
                    ) : (
                        <Link href="/login" className="btn btn-outline">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
