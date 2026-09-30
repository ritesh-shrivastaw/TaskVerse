import React from 'react';
import styles from './TagFilter.module.css';

export function TagFilter({ tags, activeTag, onSelectTag }) {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.tagButton} ${activeTag === null ? styles.active : ''}`}
        onClick={() => onSelectTag(null)}
      >
        All
      </button>
      {tags.map(({ tag, count }) => (
        <button
          key={tag}
          className={`${styles.tagButton} ${activeTag === tag ? styles.active : ''}`}
          onClick={() => onSelectTag(tag)}
        >
          {tag} ({count})
        </button>
      ))}
    </div>
  );
}
