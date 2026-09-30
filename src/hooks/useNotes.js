import { useState, useCallback, useEffect, useRef } from 'react';
import { loadNotes, saveNotes, createEmptyNote } from '../utils/storage';

/**
 * Core hook for managing notes state with localStorage persistence.
 * Provides CRUD operations and debounced auto-save.
 */
export function useNotes() {
  const [notes, setNotes] = useState(() => loadNotes());
  const [activeNoteId, setActiveNoteId] = useState(null);
  const saveTimerRef = useRef(null);

  // Persist notes to localStorage with debounce
  const persistNotes = useCallback((updatedNotes) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveNotes(updatedNotes);
    }, 300);
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  const addNote = useCallback(() => {
    const newNote = createEmptyNote();
    setNotes((prev) => {
      const next = [newNote, ...prev];
      persistNotes(next);
      return next;
    });
    setActiveNoteId(newNote.id);
    return newNote;
  }, [persistNotes]);

  const updateNote = useCallback(
    (id, changes) => {
      setNotes((prev) => {
        const next = prev.map((note) =>
          note.id === id
            ? { ...note, ...changes, updatedAt: new Date().toISOString() }
            : note
        );
        persistNotes(next);
        return next;
      });
    },
    [persistNotes]
  );

  const deleteNote = useCallback(
    (id) => {
      setNotes((prev) => {
        const next = prev.filter((note) => note.id !== id);
        persistNotes(next);
        return next;
      });
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
    },
    [activeNoteId, persistNotes]
  );

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return {
    notes: sortedNotes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    addNote,
    updateNote,
    deleteNote,
  };
}
