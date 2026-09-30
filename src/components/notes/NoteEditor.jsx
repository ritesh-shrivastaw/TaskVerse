import React, { useEffect, useRef } from 'react';
import styles from './NoteEditor.module.css';
import { EmptyState } from '../common/EmptyState';
import { NoteTitle } from './NoteTitle';
import { NoteMetaBar } from './NoteMetaBar';

export function NoteEditor({ note, onUpdateNote }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (note && contentRef.current) {
      contentRef.current.focus();
    }
  }, [note?.id]);

  if (!note) {
    return <EmptyState title="No note selected" message="Select a note or create a new one" />;
  }

  const handleTitleChange = (title) => {
    onUpdateNote(note.id, { title });
  };

  const handleContentChange = (e) => {
    onUpdateNote(note.id, { content: e.target.value });
  };

  const handleTagsUpdate = (tags) => {
    onUpdateNote(note.id, { tags });
  };

  return (
    <div className={styles.editor}>
      <NoteTitle value={note.title || ''} onChange={handleTitleChange} />
      <textarea
        ref={contentRef}
        className={styles.content}
        value={note.content || ''}
        onChange={handleContentChange}
        placeholder="Start typing..."
        aria-label="Note content"
      />
      <NoteMetaBar note={note} onUpdateTags={handleTagsUpdate} />
    </div>
  );
}
