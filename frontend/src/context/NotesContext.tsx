import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Note, SearchResult } from '../types';
import { notesApi } from '../api/notesApi';

interface NotesContextType {
  notes: Note[];
  searchResults: SearchResult[];
  loading: boolean;
  error: string | null;
  isSearching: boolean;
  fetchNotes: () => Promise<void>;
  createNote: (title: string, content: string) => Promise<void>;
  searchNotes: (query: string) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  clearSearch: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Fetch all notes on mount
  useEffect(() => {
    const loadNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedNotes = await notesApi.getAllNotes();
        setNotes(fetchedNotes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notes');
      } finally {
        setLoading(false);
      }
    };
    
    loadNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedNotes = await notesApi.getAllNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (title: string, content: string) => {
    setLoading(true);
    setError(null);
    try {
      const newNote = await notesApi.createNote(title, content);
      setNotes(prev => [...prev, newNote]);
      // Clear search when adding a new note
      if (isSearching) {
        clearSearch();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchNotes = async (query: string) => {
    setLoading(true);
    setError(null);
    setIsSearching(true);
    try {
      const results = await notesApi.searchNotes(query);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search notes');
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: number) => {
    setError(null);
    try {
      await notesApi.deleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
      // Update search results if in search mode
      if (isSearching) {
        setSearchResults(prev => prev.filter(result => result.note.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  const clearSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        searchResults,
        loading,
        error,
        isSearching,
        fetchNotes,
        createNote,
        searchNotes,
        deleteNote,
        clearSearch,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
