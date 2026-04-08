'use client';

import React from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  onCreate: () => void;
}

export default function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>📝</div>
      <h2 className={styles.heading}>No note selected</h2>
      <p className={styles.sub}>
        Select a note from the sidebar or create a new one to get started.
      </p>
      <button className={styles.btn} onClick={onCreate}>
        + New Note
      </button>
    </div>
  );
}
