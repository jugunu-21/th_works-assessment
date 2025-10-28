import type { Note, SearchResult } from '../types';

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  if (res.status === 204) {
    // @ts-expect-error allow void
    return undefined;
  }
  return res.json() as Promise<T>;
}

export const notesApi = {
  // GET /notes - Fetch all notes
  getAllNotes: async (): Promise<Note[]> => {
    return http<Note[]>('/notes');
  },

  // POST /notes - Create a new note
  createNote: async (title: string, content: string): Promise<Note> => {
    if (!title.trim() || !content.trim()) {
      throw new Error('Title and content are required');
    }
    return http<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify({ title: title.trim(), content: content.trim() }),
    });
  },

  // POST /search - Search notes with AI similarity
  searchNotes: async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) {
      // If empty query, mimic backend: just return current notes with similarity 1
      const notes = await http<Note[]>('/notes');
      return notes.map(note => ({ note, similarity: 1 }));
    }
    return http<SearchResult[]>('/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  },

  // DELETE /notes/:id - Delete a note
  deleteNote: async (id: number): Promise<void> => {
    await http<void>(`/notes/${id}`, { method: 'DELETE' });
  },
};
