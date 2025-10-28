from __future__ import annotations

from typing import List, Tuple
from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Note
from .embeddings import embed_text, cosine_similarity
from .config import settings


def create_note(db: Session, title: str, content: str) -> Note:
    embedding = embed_text(f"{title}\n{content}")
    note = Note(title=title, content=content, embedding=embedding)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def list_notes(db: Session) -> List[Note]:
    return list(db.scalars(select(Note)).all())


def delete_note(db: Session, note_id: int) -> None:
    note = db.get(Note, note_id)
    if note is None:
        return
    db.delete(note)
    db.commit()


def backfill_missing_embeddings(db: Session) -> int:
    """Populate embeddings for notes that are missing them. Returns count updated."""
    notes = list(db.scalars(select(Note)).all())
    updated = 0
    for n in notes:
        if n.embedding is None:
            n.embedding = embed_text(f"{n.title}\n{n.content}")
            updated += 1
    if updated:
        db.commit()
    return updated


def search_notes(db: Session, query: str, top_k: int = 10) -> List[Tuple[Note, float]]:
    query_embedding = embed_text(query)
    notes = list(db.scalars(select(Note)).all())

    scored_all: List[Tuple[Note, float]] = []
    for note in notes:
        if note.embedding is None:
            continue
        sim = cosine_similarity(query_embedding, note.embedding)
        scored_all.append((note, sim))

    # Sort all by similarity desc
    scored_all.sort(key=lambda x: x[1], reverse=True)

    # First pass: apply threshold filter
    filtered = [(n, s) for (n, s) in scored_all if s >= settings.min_similarity]
    if filtered:
        return filtered[:top_k]

    # Fallback: if nothing meets threshold, return top_k regardless
    return scored_all[:top_k]
