import React from 'react';
import styles from './page.module.css'; // Import CSS module for styling

export default function Loading() {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
        </div>
    );
}
