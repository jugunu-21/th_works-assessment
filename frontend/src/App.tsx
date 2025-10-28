import './App.css'
import NoteForm from './components/NoteForm'
import SearchBar from './components/SearchBar'
import NotesList from './components/NotesList'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 AI-Powered Notes Manager</h1>
        <p className="subtitle">Create, search, and manage your notes with semantic AI search</p>
      </header>
      
      <main className="app-main">
        <div className="container">
          <div className="top-section">
            <NoteForm />
            <SearchBar />
          </div>
          
          <div className="notes-section">
            <NotesList />
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Built with React + TypeScript + useContext 🚀</p>
      </footer>
    </div>
  )
}

export default App
