import { useNotes } from '../context/NotesContext';

const NotesList = () => {
  const { notes, searchResults, loading, error, isSearching, deleteNote } = useNotes();

  const displayNotes = isSearching ? searchResults : notes.map(note => ({ note, similarity: undefined }));

  if (loading && displayNotes.length === 0) {
    return <div className="loading">Loading notes...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (displayNotes.length === 0) {
    return (
      <div className="empty-state">
        {isSearching ? '🔍 No notes found matching your search' : '📝 No notes yet. Create your first note!'}
      </div>
    );
  }

  return (
    <div className="notes-list-container">
      <h2>{isSearching ? `Search Results (${displayNotes.length})` : `All Notes (${notes.length})`}</h2>
      <div className="notes-list">
        {displayNotes.map(({ note, similarity }) => (
          <div key={note.id} className="note-card">
            <div className="note-header">
              <h3>{note.title}</h3>
              <button
                onClick={() => deleteNote(note.id)}
                className="btn-delete"
                title="Delete note"
              >
                🗑️
              </button>
            </div>
            <p className="note-content">{note.content}</p>
            <div className="note-footer">
              {note.created_at && (
                <span className="note-date">
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
              )}
              {similarity !== undefined && (
                <span className="similarity-score">
                  Match: {(similarity * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;
