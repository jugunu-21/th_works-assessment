# Mini AI-Powered Notes Manager

This repo contains a full-stack notes app with a Python FastAPI backend and a React (Vite + TS) frontend. Notes are stored in PostgreSQL along with an embedding used for semantic search.

## Structure

- backend/ — FastAPI + SQLAlchemy + PostgreSQL
- frontend/ — React + Vite + TypeScript

## Quick Start

### Prerequisites

- Node.js 20.19+ (for Vite)
- PostgreSQL 16 (local)
- Python 3.12 (recommended)

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt

# Choose one DATABASE_URL approach
# A) Local socket (no password) — simplest
export DATABASE_URL="postgresql+psycopg2:///notes_db"
createdb notes_db 2>/dev/null || true

# B) Passworded role
# psql -d postgres -c "DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='postgres') THEN CREATE ROLE postgres LOGIN SUPERUSER PASSWORD 'postgres'; END IF; END $$;"
# createdb notes_db 2>/dev/null || true
# psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE notes_db TO postgres;" 2>/dev/null || true
# export DATABASE_URL="postgresql+psycopg2://postgres:postgres@localhost:5432/notes_db"

# Optional CORS (defaults already allow Vite dev)
export ALLOWED_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"

uvicorn app.main:app --reload
```

Open API docs at http://127.0.0.1:8000/docs

### Frontend

```bash
cd frontend
cp .env.example .env # or set VITE_API_BASE_URL
npm install
npm run dev
```

- Visit the app at the printed Vite URL (default http://localhost:5173)

## Requirements Checklist

- Backend: FastAPI with endpoints
  - POST /notes — create note (title, content) and store embedding
  - GET /notes — list notes
  - POST /search — returns most relevant notes (cosine similarity)
- Database: PostgreSQL table `notes(id, title, content, embedding JSON)`
- Frontend: React form to create, search bar, list display
- AI: Local embedding function and cosine similarity (no external hosted model required)
- Docs: This README, backend/README, DECLARATION.md, notes.md

## Scripts

- Backend run: `uvicorn app.main:app --reload`
- Frontend dev: `npm run dev`

## Notes

If Python 3.13 is used, PyTorch wheels may be unavailable; this project uses a torch-free embedding implementation for smooth setup.
