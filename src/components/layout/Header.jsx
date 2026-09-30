import React from 'react';
import { Menu, Plus } from 'lucide-react';
import styles from './Header.module.css';

export function Header({ searchBar, themeToggle, onNewNote, onToggleSidebar }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button 
          className={styles.menuButton} 
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <span className={styles.appName}>TaskVerse Notes</span>
      </div>
      
      <div className={styles.center}>
        {searchBar}
      </div>
      
      <div className={styles.right}>
        {themeToggle}
        <button 
          className={styles.newNoteButton} 
          onClick={onNewNote}
          aria-label="Create new note"
        >
          <Plus size={20} />
          <span>New Note</span>
        </button>
      </div>
    </header>
  );
}
