# Design Notes

## Backend Design

- FastAPI chosen for speed, type hints, and automatic docs.
- Layers: `schemas.py`, `models.py`, `crud.py`, `embeddings.py`, `main.py`, `database.py`.
- Tables created via SQLAlchemy metadata.

## Database Schema

- Table `notes`:
  - `id INT PK`
  - `title TEXT NOT NULL`
  - `content TEXT NOT NULL`
  - `embedding JSON` (array[float])

## AI Search

- Default: hashing-based embedding — deterministic numeric vector from note text (title + content). Pros: no heavy deps, works offline; Cons: not SOTA semantics.
- Optional: set `EMBEDDINGS_BACKEND=sbert` and install `sentence-transformers`. Model name via `EMBEDDING_MODEL_NAME` (default `sentence-transformers/all-MiniLM-L6-v2`). If import/model load fails, the code automatically falls back to hashing.
- Storage: embedding stored per note in JSON column as float array. Query embeds the input and computes cosine similarity against stored vectors, sorts desc, returns top results.

## Frontend

- React + Vite TS. Context state. Calls backend API for create/list/search/delete.

## Trade-offs

- Portability prioritized over model accuracy by default; an optional SBERT path is provided for stronger semantics when environment supports torch.
- No Alembic; metadata create_all for simplicity.
