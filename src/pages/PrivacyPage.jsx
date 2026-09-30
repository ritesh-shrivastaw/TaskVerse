import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './PrivacyPage.module.css';

export const PrivacyPage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.backLink} aria-label="Back to TaskVerse Notes">
          <ArrowLeft size={20} aria-hidden="true" />
          <span>Back to TaskVerse Notes</span>
        </Link>
      </header>
      
      <main className={styles.content}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.dateLabel}>Last Updated: October 1, 2026</p>
        
        <section className={styles.section}>
          <h2>Data Collection</h2>
          <p>We believe your data belongs to you. TaskVerse Notes is designed to store all your notes locally in your web browser. We do not collect or transmit your notes to any external servers.</p>
        </section>
        
        <section className={styles.section}>
          <h2>Data Storage</h2>
          <p>All information, including notes and tags, is saved using your browser's localStorage. Because there is no server transmission, if you clear your browser data or use a different device, your notes will not be available.</p>
        </section>
        
        <section className={styles.section}>
          <h2>Cookies</h2>
          <p>We do not use tracking cookies. We only use localStorage to remember your preferences, such as your selected theme.</p>
        </section>
        
        <section className={styles.section}>
          <h2>Third-Party Services</h2>
          <p>We do not use any analytics services. There is no third-party data sharing involved in the operation of this application.</p>
        </section>
        
        <section className={styles.section}>
          <h2>Your Rights</h2>
          <p>You have complete control over your data. You can clear all your notes and preferences at any time by clearing your browser storage.</p>
        </section>
        
        <section className={styles.section}>
          <h2>Contact</h2>
          <p>If you have any questions about this privacy policy, please contact us at privacy@taskverse.notes.</p>
        </section>
      </main>
    </div>
  );
};
