import React from 'react';
import styles from './AppShell.module.css';

export function AppShell({ sidebar, children, sidebarOpen, onToggleSidebar }) {
  return (
    <div className={styles.shell}>
      {sidebarOpen && (
        <div 
          className={styles.overlay} 
          onClick={onToggleSidebar}
          role="presentation"
        />
      )}
      <aside className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.open : ''}`}>
        {sidebar}
      </aside>
      <div className={styles.mainWrapper}>
        {children}
      </div>
    </div>
  );
}
