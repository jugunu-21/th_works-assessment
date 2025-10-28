from __future__ import annotations

from typing import List, Tuple
from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Note
from .embeddings import embed_text, cosine_similarity


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


def search_notes(db: Session, query: str, top_k: int = 10) -> List[Tuple[Note, float]]:
    query_embedding = embed_text(query)
    notes = list(db.scalars(select(Note)).all())

    scored: List[Tuple[Note, float]] = []
    for note in notes:
        if note.embedding is None:
            continue
        sim = cosine_similarity(query_embedding, note.embedding)
        scored.append((note, sim))

    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:top_k]
