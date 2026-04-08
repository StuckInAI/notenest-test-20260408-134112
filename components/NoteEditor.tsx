'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Note } from './NotesApp';
import styles from './NoteEditor.module.css';

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, changes: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  colors: string[];
}

function formatFull(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  } as Intl.DateTimeFormatOptions);
}

export default function NoteEditor({
  note,
  onUpdate,
  onDelete,
  onTogglePin,
  colors,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [category, setCategory] = useState(note.category);
  const [editingCategory, setEditingCategory] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
  }, [note.id]);

  const scheduleUpdate = (changes: Partial<Note>) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onUpdate(note.id, changes);
    }, 400);
  };

  const handleTitle = (v: string) => {
    setTitle(v);
    scheduleUpdate({ title: v });
  };

  const handleContent = (v: string) => {
    setContent(v);
    scheduleUpdate({ content: v });
  };

  const handleCategory = (v: string) => {
    setCategory(v);
    onUpdate(note.id, { category: v });
    setEditingCategory(false);
  };

  const handleColorSelect = (color: string) => {
    onUpdate(note.id, { color });
    setShowColors(false);
  };

  const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
  const charCount = content.length;

  return (
    <div className={styles.editor} style={{ background: note.color }}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div style={{ width: 52 }} />
          <div className={styles.categoryWrap}>
            {editingCategory ? (
              <input
                autoFocus
                className={styles.categoryInput}
                value={category}
                onChange={e => setCategory(e.target.value)}
                onBlur={e => handleCategory(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCategory(category);
                  if (e.key === 'Escape') setEditingCategory(false);
                }}
              />
            ) : (
              <button
                className={styles.categoryBadge}
                onClick={() => setEditingCategory(true)}
                title="Click to change category"
              >
                📁 {note.category}
              </button>
            )}
          </div>
        </div>
        <div className={styles.toolbarRight}>
          <div className={styles.colorPickerWrap}>
            <button
              className={styles.colorBtn}
              onClick={() => setShowColors(v => !v)}
              title="Change color"
              style={{ background: note.color, border: '2px solid var(--border)' }}
            />
            {showColors && (
              <div className={styles.colorPalette}>
                {colors.map(c => (
                  <button
                    key={c}
                    className={`${styles.colorSwatch} ${note.color === c ? styles.colorSwatchActive : ''}`}
                    style={{ background: c }}
                    onClick={() => handleColorSelect(c)}
                    title={c}
                  />
                ))}
              </div>
            )}
          </div>
          <button
            className={`${styles.iconBtn} ${note.pinned ? styles.iconBtnActive : ''}`}
            onClick={() => onTogglePin(note.id)}
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            📌
          </button>
          <button
            className={`${styles.iconBtn} ${styles.deleteBtn}`}
            onClick={() => onDelete(note.id)}
            title="Delete note"
          >
            🗑
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <input
          ref={titleRef}
          className={styles.title}
          value={title}
          onChange={e => handleTitle(e.target.value)}
          placeholder="Note title..."
          spellCheck
        />

        <div className={styles.timestamps}>
          <span>Created: {formatFull(note.createdAt)}</span>
          <span>·</span>
          <span>Modified: {formatFull(note.updatedAt)}</span>
        </div>

        <textarea
          className={styles.content}
          value={content}
          onChange={e => handleContent(e.target.value)}
          placeholder="Start writing your note here..."
          spellCheck
        />
      </div>

      <div className={styles.footer}>
        <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
        <span>{charCount} {charCount === 1 ? 'character' : 'characters'}</span>
        <span className={styles.savedIndicator}>✓ Saved</span>
      </div>
    </div>
  );
}
