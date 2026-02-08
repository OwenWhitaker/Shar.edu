"use client";

import { useRouter } from 'next/navigation';
import { useRef, useEffect } from 'react';
import styles from './Modal.module.css';

export default function Modal({ children }) {
    const overlay = useRef(null);
    const wrapper = useRef(null);
    const router = useRouter();

    const onDismiss = () => {
        router.back();
    };

    const onClick = (e) => {
        if (e.target === overlay.current || e.target === wrapper.current) {
            if (onDismiss) onDismiss();
        }
    };

    const onKeyDown = (e) => {
        if (e.key === 'Escape') onDismiss();
    };

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onKeyDown]);

    return (
        <div
            ref={overlay}
            className={styles.overlay}
            onClick={onClick}
        >
            <div
                ref={wrapper}
                className={styles.wrapper}
            >
                <div className={styles.modalContent}>
                    <button className={styles.closeBtn} onClick={onDismiss}>×</button>
                    {children}
                </div>
            </div>
        </div>
    );
}
