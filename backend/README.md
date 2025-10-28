## Backend (FastAPI) - AI Notes API

### Stack

- FastAPI, SQLAlchemy 2.0, PostgreSQL
- Lightweight hashing-based embeddings (no PyTorch required)

### Environment

Create `.env` in `backend/` (optional; you can export vars instead):

```
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/notes_db
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Install

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
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

Embeddings are generated deterministically using a hashing-based vectorization and stored as an array of floats (JSON). Search computes cosine similarity between the query embedding and stored embeddings, sorts, and returns top results.
