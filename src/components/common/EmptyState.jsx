import React from 'react';
import styles from './EmptyState.module.css';

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className={styles.container}>
      {Icon && <Icon className={styles.icon} size={48} />}
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
