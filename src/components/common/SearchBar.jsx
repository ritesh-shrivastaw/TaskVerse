import React from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

export function SearchBar({ value, onChange, placeholder = "Search notes..." }) {
  return (
    <div className={styles.container} role="search">
      <div className={styles.inputWrapper}>
        <Search className={styles.icon} size={16} />
        <input
          type="text"
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search"
        />
        {value && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
