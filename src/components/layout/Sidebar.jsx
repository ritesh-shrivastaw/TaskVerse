import React from 'react';
import styles from './Sidebar.module.css';

export function Sidebar({ tagFilter, noteList }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.topSection}>
        <h2 className={styles.heading}>Tags</h2>
        {tagFilter}
      </div>
      <div className={styles.divider} role="separator" />
      <div className={styles.bottomSection}>
        {noteList}
      </div>
    </div>
  );
}
