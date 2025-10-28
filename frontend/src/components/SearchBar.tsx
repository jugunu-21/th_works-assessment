import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNotes } from '../context/NotesContext';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { searchNotes, clearSearch, loading, isSearching } = useNotes();

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      await searchNotes(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
  };

  return (
    <div className="search-bar-container">
      <h2>🔍 AI-Powered Search</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search notes with AI semantic search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          className="search-input"
        />
        <div className="search-buttons">
          <button type="submit" disabled={loading || !query.trim()} className="btn-search">
            {loading ? 'Searching...' : 'Search'}
          </button>
          {isSearching && (
            <button type="button" onClick={handleClear} className="btn-clear">
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
