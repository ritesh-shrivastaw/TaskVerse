import React from 'react';
import styles from './Button.module.css';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'default', 
  icon: Icon, 
  className = '',
  ...rest 
}) {
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`.trim();

  return (
    <button className={buttonClass} {...rest}>
      {Icon && <Icon className={styles.icon} size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
}
