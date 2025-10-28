from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class NoteCreate(BaseModel):
    title: str = Field(..., min_length=1)
    content: str = Field(..., min_length=1)


class NoteRead(BaseModel):
    id: int
    title: str
    content: str

    class Config:
        from_attributes = True


class SearchQuery(BaseModel):
    query: str = Field(..., min_length=1)


class SearchResult(BaseModel):
    note: NoteRead
    similarity: float
