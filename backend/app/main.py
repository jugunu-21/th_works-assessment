from __future__ import annotations

from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .config import settings
from .database import Base, engine, get_db
from . import crud
from .schemas import NoteCreate, NoteRead, SearchQuery, SearchResult

# Create tables if not present
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Notes API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/notes", response_model=List[NoteRead])
def get_notes(db: Session = Depends(get_db)):
    notes = crud.list_notes(db)
    return [NoteRead.model_validate(n) for n in notes]


@app.post("/notes", response_model=NoteRead, status_code=201)
def create_note(payload: NoteCreate, db: Session = Depends(get_db)):
    note = crud.create_note(db, title=payload.title, content=payload.content)
    return NoteRead.model_validate(note)


@app.delete("/notes/{note_id}", status_code=204)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.get(crud.Note, note_id)  # type: ignore[attr-defined]
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    crud.delete_note(db, note_id)
    return


@app.post("/search", response_model=List[SearchResult])
def search_notes(payload: SearchQuery, db: Session = Depends(get_db)):
    results = crud.search_notes(db, query=payload.query)
    return [SearchResult(note=NoteRead.model_validate(n), similarity=s) for n, s in results]
