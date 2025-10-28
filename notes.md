# Design Notes

## Backend Design

- FastAPI chosen for speed, type hints, and automatic docs.
- Layers: `schemas.py` (Pydantic), `models.py` (SQLAlchemy), `crud.py` (DB ops), `embeddings.py` (vector + cosine), `main.py` (routes), `database.py` (engine/session).
- Tables created via SQLAlchemy metadata (`Base.metadata.create_all`).

## Database Schema

- Table `notes`:
  - `id INT PK`
  - `title TEXT NOT NULL`
  - `content TEXT NOT NULL`
  - `embedding JSON` (array[float])
- Embedding indexed in-memory at query time (for simplicity). For scale, consider pgvector.

## AI Search

- Embedding is generated locally using a deterministic hashing-based vector (no external dependencies), stored with each note.
- Search: embed query, compute cosine similarity vs stored embeddings, sort desc, return top results.
- Trade-off: not SOTA semantically; avoids heavyweight installs and works offline. Swappable for `sentence-transformers` later.

## Frontend

- React + Vite TS. Context for state. API layer calls backend.
- Components: Note form, search bar, notes list.

## Trade-offs

- Simpler embedding for portability and easy setup on Python 3.12+/macOS without torch.
- No migrations tool included; SQLAlchemy metadata creates tables. Could add Alembic if needed.
- Basic CORS config for local dev.
