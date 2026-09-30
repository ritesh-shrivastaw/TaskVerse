const STORAGE_KEY = 'taskverse-notes';

/**
 * Load all notes from localStorage.
 * @returns {Array} Array of note objects
 */
export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save all notes to localStorage.
 * @param {Array} notes Array of note objects
 */
export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save notes:', err);
  }
}

/**
 * Create a new empty note.
 * @returns {Object} A new note with generated ID and timestamps
 */
export function createEmptyNote() {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: '',
    content: '',
    tags: [],
    createdAt: now,
    updatedAt: now,
  };
}
