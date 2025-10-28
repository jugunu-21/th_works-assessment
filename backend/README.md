## Backend (FastAPI) - AI Notes API

### Stack

- FastAPI, SQLAlchemy 2.0, PostgreSQL
- Embeddings: hashing-based by default (no torch). Optional `sentence-transformers` if you enable it.

### Environment

Create `.env` in `backend/` (optional):

```
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/notes_db
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
# Optional: switch embedding backend to sentence-transformers
# EMBEDDINGS_BACKEND=sbert
# EMBEDDING_MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
```

### Install

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt

# Optional: enable sentence-transformers (requires torch wheels compatible with your Python)
# pip install sentence-transformers
```

### Run

```bash
uvicorn app.main:app --reload
```

### API

- POST `/notes` { title, content } -> Note
- GET `/notes` -> [Note]
- POST `/search` { query } -> [{ note, similarity }]

### Schema

`notes(id PK, title TEXT NOT NULL, content TEXT NOT NULL, embedding JSON)`

Embeddings are generated either via a deterministic hashing-based vector (default) or `sentence-transformers` if enabled. Stored as an array of floats (JSON). Search computes cosine similarity and sorts results.
