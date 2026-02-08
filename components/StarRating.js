"use client";

import styles from './StarRating.module.css';

export default function StarRating({ rating }) {
    // Clamp rating between 0 and 5
    const clampedRating = Math.max(0, Math.min(5, rating));

    // Create array of 5 items
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className={styles.starContainer}>
            {stars.map((star) => {
                // Calculate how much of this star should be filled
                // e.g. rating 3.5:
                // star 1: 100%
                // star 2: 100%
                // star 3: 100%
                // star 4: 50%
                // star 5: 0%
                let fillPercentage = 0;
                if (clampedRating >= star) {
                    fillPercentage = 100;
                } else if (clampedRating > star - 1) {
                    fillPercentage = (clampedRating - (star - 1)) * 100;
                }

                return (
                    <div key={star} className={styles.starWrapper}>
                        {/* Empty Star Background */}
                        <span className={styles.starEmpty}>★</span>

                        {/* Filled Star Overlay */}
                        <span
                            className={styles.starFill}
                            style={{ width: `${fillPercentage}%` }}
                        >
                            ★
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
