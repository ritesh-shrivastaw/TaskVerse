import React from 'react';
import styles from './NoteList.module.css';
import { EmptyState } from '../common/EmptyState';
import { NoteListItem } from './NoteListItem';

export function NoteList({ notes, activeNoteId, onSelectNote, onDeleteNote }) {
  if (!notes || notes.length === 0) {
    return <EmptyState title="No notes found" message="Create a new note to get started." />;
  }

  return (
    <div className={styles.noteList}>
      {notes.map(note => (
        <NoteListItem
          key={note.id}
          note={note}
          isActive={note.id === activeNoteId}
          onSelect={() => onSelectNote(note.id)}
          onDelete={() => onDeleteNote(note.id)}
        />
      ))}
    </div>
  );
}
