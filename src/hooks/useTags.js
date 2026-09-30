import { useMemo } from 'react';

/**
 * Derives tag data from the notes array.
 * Returns all unique tags with counts and filtered notes.
 */
export function useTags(notes, activeTag = null) {
  const tagCounts = useMemo(() => {
    const counts = {};
    for (const note of notes) {
      for (const tag of note.tags) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }
    return counts;
  }, [notes]);

  const allTags = useMemo(() => {
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [tagCounts]);

  const filteredNotes = useMemo(() => {
    if (!activeTag) return notes;
    return notes.filter((note) => note.tags.includes(activeTag));
  }, [notes, activeTag]);

  return { allTags, filteredNotes, tagCounts };
}
