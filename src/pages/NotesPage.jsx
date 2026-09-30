import React, { useState, useMemo, useCallback } from 'react';
import { useNotes } from '../hooks/useNotes';
import { useTheme } from '../hooks/useTheme';
import { useTags } from '../hooks/useTags';
import { AppShell } from '../components/layout/AppShell';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { NoteList } from '../components/notes/NoteList';
import { NoteEditor } from '../components/notes/NoteEditor';
import { SearchBar } from '../components/common/SearchBar';
import { TagFilter } from '../components/common/TagFilter';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const NotesPage = () => {
  const { notes, activeNoteId, setActiveNoteId, addNote, updateNote, deleteNote } = useNotes();
  const { theme, toggleTheme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tags = useTags(notes, activeTag);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = activeTag ? note.tags.includes(activeTag) : true;
      
      return matchesSearch && matchesTag;
    });
  }, [notes, searchQuery, activeTag]);

  const activeNote = useMemo(() => {
    return notes.find(n => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  const handleNoteSelect = useCallback((id) => {
    setActiveNoteId(id);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [setActiveNoteId]);

  const handleNewNote = useCallback(() => {
    const newNote = addNote();
    setActiveNoteId(newNote.id);
    setSearchQuery('');
    setActiveTag(null);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [addNote, setActiveNoteId]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const header = (
    <Header 
      onMenuClick={toggleSidebar}
      onNewNote={handleNewNote}
    >
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
      />
      <ThemeToggle 
        theme={theme}
        onToggle={toggleTheme}
      />
    </Header>
  );

  const sidebar = (
    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
      <TagFilter 
        tags={tags}
        activeTag={activeTag}
        onTagSelect={setActiveTag}
      />
      <NoteList 
        notes={filteredNotes}
        activeNoteId={activeNoteId}
        onNoteSelect={handleNoteSelect}
      />
    </Sidebar>
  );

  return (
    <AppShell header={header} sidebar={sidebar}>
      {activeNote ? (
        <NoteEditor 
          note={activeNote}
          onChange={updateNote}
          onDelete={deleteNote}
        />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)' }}>
          Select a note or create a new one
        </div>
      )}
    </AppShell>
  );
};
