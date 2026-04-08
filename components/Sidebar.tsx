'use client';

import React from 'react';
import type { Note, SortOption } from './NotesApp';
import NoteCard from './NoteCard';
import styles from './Sidebar.module.css';

interface SidebarProps {
  notes: Note[];
  allNotes: Note[];
  selectedId: string | null;
  search: string;
  category: string;
  categories: string[];
  sort: SortOption;
  onSearch: (v: string) => void;
  onCategory: (v: string) => void;
  onSort: (v: SortOption) => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export default function Sidebar({
  notes,
  selectedId,
  search,
  category,
  categories,
  sort,
  onSearch,
  onCategory,
  onSort,
  onSelect,
  onCreate,
  onDelete,
  onTogglePin,
}: SidebarProps) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>📝</span>
          <span className={styles.brandName}>Notes</span>
        </div>
        <button className={styles.newBtn} onClick={onCreate} title="New Note">
          <span>+</span>
        </button>
      </div>

      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.search}
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
        {search && (
          <button className={styles.clearSearch} onClick={() => onSearch('')}>
            ✕
          </button>
        )}
      </div>

      <div className={styles.filters}>
        <div className={styles.categoryRow}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.catBtn} ${category === cat ? styles.catBtnActive : ''}`}
              onClick={() => onCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className={styles.sortRow}>
          <label className={styles.sortLabel}>Sort:</label>
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={e => onSort(e.target.value as SortOption)}
          >
            <option value="updatedAt">Modified</option>
            <option value="createdAt">Created</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      <div className={styles.noteCount}>
        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
      </div>

      <div className={styles.list}>
        {notes.length === 0 ? (
          <div className={styles.empty}>
            <p>No notes found.</p>
            <button className={styles.emptyCreate} onClick={onCreate}>
              Create one
            </button>
          </div>
        ) : (
          notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              selected={note.id === selectedId}
              onSelect={() => onSelect(note.id)}
              onDelete={() => onDelete(note.id)}
              onTogglePin={() => onTogglePin(note.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
