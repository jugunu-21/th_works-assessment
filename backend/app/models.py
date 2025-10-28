from __future__ import annotations

from sqlalchemy import String, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(String, nullable=False)
    embedding: Mapped[list[float] | None] = mapped_column(JSON, nullable=True)
