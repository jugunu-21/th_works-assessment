import os
from typing import List

from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from a .env file if present
load_dotenv()


class Settings(BaseModel):
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres:postgres@localhost:5432/notes_db",
    )
    allowed_origins: List[str] = (
        os.getenv(
            "ALLOWED_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if os.getenv("ALLOWED_ORIGINS") is not None
        else ["http://localhost:5173", "http://127.0.0.1:5173"]
    )


settings = Settings()
