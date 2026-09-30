import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import styles from './NoteMetaBar.module.css';
import { formatDate } from '../../utils/dates';

export function NoteMetaBar({ note, onUpdateTags }) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleAddTagClick = () => {
    setIsAddingTag(true);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (tagInput.trim()) {
        const newTags = [...(note.tags || []), tagInput.trim()];
        onUpdateTags(newTags);
        setTagInput('');
        setIsAddingTag(false);
      }
    } else if (e.key === 'Escape') {
      setIsAddingTag(false);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = (note.tags || []).filter(tag => tag !== tagToRemove);
    onUpdateTags(newTags);
  };

  return (
    <div className={styles.metaBar}>
      <div className={styles.tagsContainer}>
        {(note.tags || []).map((tag, index) => (
          <div key={index} className={styles.tag}>
            <span>{tag}</span>
            <button 
              className={styles.removeTag} 
              onClick={() => handleRemoveTag(tag)}
              aria-label={`Remove tag ${tag}`}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        
        {isAddingTag ? (
          <input
            type="text"
            className={styles.tagInput}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            onBlur={() => { setIsAddingTag(false); setTagInput(''); }}
            autoFocus
            placeholder="New tag..."
            aria-label="Add tag"
          />
        ) : (
          <button 
            className={styles.addTagBtn} 
            onClick={handleAddTagClick}
            aria-label="Add tag"
          >
            <Plus size={14} />
          </button>
        )}
      </div>
      
      <div className={styles.updatedAt}>
        Updated: {formatDate(note.updatedAt)}
      </div>
    </div>
  );
}
