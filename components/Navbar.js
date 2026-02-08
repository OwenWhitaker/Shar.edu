"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();
    const { user, isAuthenticated } = useAuth();

    const isActive = (path) => pathname === path;

    return (
        <nav className={styles.bottomNavContainer}>
            <div className={styles.navPill}>
                <Link href="/" className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}>
                    <div className={styles.iconWrapper}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </div>
                    <span className={styles.label}>Home</span>
                </Link>

                <Link href="/search" className={`${styles.navItem} ${isActive('/search') ? styles.active : ''}`}>
                    <div className={styles.iconWrapper}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                    <span className={styles.label}>Search</span>
                </Link>

                {/* Create Button with Label */}
                {/* Create Button with Label - Hide on /create */}
                {pathname !== '/create' && (
                    <Link href="/create" className={styles.createItem}>
                        <div className={styles.createButton}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                        </div>
                        <span className={styles.label}>List</span>
                    </Link>
                )}

                {isAuthenticated ? (
                    <>
                        <Link href="/requests" className={`${styles.navItem} ${isActive('/requests') ? styles.active : ''}`}>
                            <div className={styles.iconWrapper}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                            </div>
                            <span className={styles.label}>Activity</span>
                        </Link>

                        <Link href="/profile" className={`${styles.navItem} ${isActive('/profile') ? styles.active : ''}`}>
                            <div className={styles.avatarContainer}>
                                {user?.image ? (
                                    <img src={user.image} alt="Profile" className={styles.avatarImg} />
                                ) : (
                                    <span className={styles.avatarPlaceholder}>{user?.name?.[0]}</span>
                                )}
                            </div>
                            <span className={styles.label}>Profile</span>
                        </Link>
                    </>
                ) : (
                    <Link href="/login" className={`${styles.navItem} ${isActive('/login') ? styles.active : ''}`}>
                        <div className={styles.iconWrapper}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <span className={styles.label}>Login</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}
