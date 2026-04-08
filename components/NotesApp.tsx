'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './Sidebar';
import NoteEditor from './NoteEditor';
import EmptyState from './EmptyState';
import styles from './NotesApp.module.css';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  color: string;
}

export type SortOption = 'updatedAt' | 'createdAt' | 'title';

const DEFAULT_COLORS = ['#ffffff', '#fef9c3', '#dcfce7', '#dbeafe', '#fce7f3', '#ede9fe'];

const STORAGE_KEY = 'notes-app-data';

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState<SortOption>('updatedAt');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Note[];
        setNotes(parsed);
        if (parsed.length > 0) {
          setSelectedId(parsed[0].id);
        }
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes, loaded]);

  const createNote = useCallback(() => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '',
      category: category !== 'All' ? category : 'General',
      createdAt: now,
      updatedAt: now,
      pinned: false,
      color: DEFAULT_COLORS[0],
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedId(newNote.id);
  }, [category]);

  const updateNote = useCallback((id: string, changes: Partial<Note>) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, ...changes, updatedAt: new Date().toISOString() }
          : n
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => {
      const filtered = prev.filter(n => n.id !== id);
      if (selectedId === id) {
        setSelectedId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  }, [selectedId]);

  const togglePin = useCallback((id: string) => {
    setNotes(prev =>
      prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)
    );
  }, []);

  const categories = ['All', ...Array.from(new Set(notes.map(n => n.category))).sort()];

  const filteredNotes = notes
    .filter(n => {
      const matchSearch =
        search === '' ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || n.category === category;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const selectedNote = notes.find(n => n.id === selectedId) ?? null;

  if (!loaded) return null;

  return (
    <div className={styles.app}>
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <Sidebar
          notes={filteredNotes}
          allNotes={notes}
          selectedId={selectedId}
          search={search}
          category={category}
          categories={categories}
          sort={sort}
          onSearch={setSearch}
          onCategory={setCategory}
          onSort={setSort}
          onSelect={setSelectedId}
          onCreate={createNote}
          onDelete={deleteNote}
          onTogglePin={togglePin}
        />
      </div>
      <div className={styles.main}>
        <button
          className={styles.toggleBtn}
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
        {selectedNote ? (
          <NoteEditor
            key={selectedNote.id}
            note={selectedNote}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onTogglePin={togglePin}
            colors={DEFAULT_COLORS}
          />
        ) : (
          <EmptyState onCreate={createNote} />
        )}
      </div>
    </div>
  );
}
