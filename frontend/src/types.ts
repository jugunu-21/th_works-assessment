export interface Note {
  id: number;
  title: string;
  content: string;
  created_at?: string;
}

export interface SearchResult {
  note: Note;
  similarity?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
