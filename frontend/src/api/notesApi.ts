import type { Note, SearchResult } from '../types';

// Dummy data storage
let notesStorage: Note[] = [
  {
    id: 1,
    title: 'Welcome Note',
    content: 'This is your first note. Start creating more notes to test the AI search!',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'About AI Search',
    content: 'The AI-powered search uses semantic similarity to find relevant notes based on meaning, not just keywords.',
    created_at: new Date().toISOString(),
  },
];

let nextId = 3;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple similarity calculation (dummy implementation)
const calculateSimilarity = (query: string, text: string): number => {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Check for exact matches
  if (textLower.includes(queryLower)) {
    return 0.9;
  }
  
  // Check for word overlaps
  const queryWords = queryLower.split(' ');
  const textWords = textLower.split(' ');
  const overlap = queryWords.filter(word => textWords.includes(word)).length;
  
  return overlap / queryWords.length * 0.7;
};

export const notesApi = {
  // GET /notes - Fetch all notes
  getAllNotes: async (): Promise<Note[]> => {
    await delay(300); // Simulate network delay
    return [...notesStorage];
  },

  // POST /notes - Create a new note
  createNote: async (title: string, content: string): Promise<Note> => {
    await delay(400);
    
    if (!title.trim() || !content.trim()) {
      throw new Error('Title and content are required');
    }
    
    const newNote: Note = {
      id: nextId++,
      title: title.trim(),
      content: content.trim(),
      created_at: new Date().toISOString(),
    };
    
    notesStorage.push(newNote);
    return newNote;
  },

  // POST /search - Search notes with AI similarity
  searchNotes: async (query: string): Promise<SearchResult[]> => {
    await delay(500);
    
    if (!query.trim()) {
      return notesStorage.map(note => ({ note, similarity: 1 }));
    }
    
    const results: SearchResult[] = notesStorage.map(note => {
      const titleSimilarity = calculateSimilarity(query, note.title);
      const contentSimilarity = calculateSimilarity(query, note.content);
      const similarity = Math.max(titleSimilarity, contentSimilarity);
      
      return { note, similarity };
    });
    
    // Filter and sort by similarity
    return results
      .filter(result => (result.similarity ?? 0) > 0.1)
      .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));
  },

  // DELETE /notes/:id - Delete a note
  deleteNote: async (id: number): Promise<void> => {
    await delay(300);
    notesStorage = notesStorage.filter(note => note.id !== id);
  },
};
