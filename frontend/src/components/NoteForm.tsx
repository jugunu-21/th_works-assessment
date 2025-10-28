import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNotes } from '../context/NotesContext';

const NoteForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { createNote, loading } = useNotes();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      await createNote(title, content);
      setTitle('');
      setContent('');
    } catch (error) {
      // Error is handled in context
    }
  };

  return (
    <div className="note-form-container">
      <h2>Create New Note</h2>
      <form onSubmit={handleSubmit} className="note-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            rows={5}
            className="form-textarea"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Creating...' : 'Create Note'}
        </button>
      </form>
    </div>
  );
};

export default NoteForm;
