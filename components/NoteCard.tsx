'use client';

import React from 'react';
import type { Note } from './NotesApp';
import styles from './NoteCard.module.css';

interface NoteCardProps {
  note: Note;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default function NoteCard({
  note,
  selected,
  onSelect,
  onDelete,
  onTogglePin,
}: NoteCardProps) {
  const preview = note.content
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 80);

  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      style={{ borderLeft: `3px solid ${note.color === '#ffffff' ? 'transparent' : note.color}` }}
      onClick={onSelect}
    >
      <div className={styles.top}>
        <span className={styles.title}>{note.title || 'Untitled'}</span>
        <div className={styles.actions}>
          <button
            className={`${styles.pinBtn} ${note.pinned ? styles.pinned : ''}`}
            onClick={e => { e.stopPropagation(); onTogglePin(); }}
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            📌
          </button>
          <button
            className={styles.deleteBtn}
            onClick={e => { e.stopPropagation(); onDelete(); }}
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>
      {preview && <p className={styles.preview}>{preview}</p>}
      <div className={styles.meta}>
        <span className={styles.category}>{note.category}</span>
        <span className={styles.date}>{formatDate(note.updatedAt)}</span>
      </div>
    </div>
  );
}
