import React from 'react';
import { Trash2 } from 'lucide-react';
import styles from './NoteListItem.module.css';

export function NoteListItem({ note, isActive, onSelect, onDelete }) {
  const title = note.title || "Untitled";
  const contentPreview = note.content ? note.content.substring(0, 80) : "";
  const displayDate = new Date(note.createdAt).toLocaleDateString();

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div 
      className={`${styles.noteItem} ${isActive ? styles.active : ''}`}
      onClick={onSelect}
    >
      <div className={styles.header}>
        <div className={`${styles.title} ${!note.title ? styles.untitled : ''}`}>
          {title}
        </div>
        <button 
          className={styles.deleteButton} 
          onClick={handleDelete}
          aria-label="Delete note"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className={styles.preview}>
        {contentPreview}{note.content?.length > 80 ? "..." : ""}
      </div>
      <div className={styles.footer}>
        {displayDate}
      </div>
    </div>
  );
}
