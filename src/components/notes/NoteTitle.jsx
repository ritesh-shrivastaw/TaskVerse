import React from 'react';
import styles from './NoteEditor.module.css';

export function NoteTitle({ value, onChange }) {
  return (
    <input
      type="text"
      className={styles.titleInput}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Untitled"
      aria-label="Note title"
    />
  );
}
