from __future__ import annotations

from typing import List
import hashlib
import numpy as np

from .config import settings


# Optional import for sentence-transformers; we fall back if not present
_SBERT_AVAILABLE = False
try:
    if settings.embeddings_backend == "sbert":
        from sentence_transformers import SentenceTransformer  # type: ignore
        _SBERT_AVAILABLE = True
except Exception:
    _SBERT_AVAILABLE = False


# Simple hashing-based embedding without external ML deps
# Deterministic vector from text using multiple hash seeds
_HASH_SEEDS = [b"s1", b"s2", b"s3", b"s4", b"s5", b"s6", b"s7", b"s8"]
_VECTOR_SIZE = 128

_sbert_model = None
if _SBERT_AVAILABLE:
    try:
        _sbert_model = SentenceTransformer(settings.embedding_model_name or "sentence-transformers/all-MiniLM-L6-v2")
    except Exception:
        _SBERT_AVAILABLE = False
        _sbert_model = None


def _hash_to_vector(text: str) -> np.ndarray:
    vec = np.zeros(_VECTOR_SIZE, dtype=np.float32)
    data = text.encode("utf-8", errors="ignore")
    for seed in _HASH_SEEDS:
        h = hashlib.blake2b(data + seed, digest_size=32).digest()
        for i, byte in enumerate(h):
            vec[i % _VECTOR_SIZE] += (byte - 128) / 128.0
    # Normalize
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec


def embed_texts(texts: List[str]) -> List[List[float]]:
    if _SBERT_AVAILABLE and _sbert_model is not None:
        embs = _sbert_model.encode(texts, normalize_embeddings=True)
        return embs.tolist()
    return [_hash_to_vector(t).tolist() for t in texts]


def embed_text(text: str) -> List[float]:
    return embed_texts([text])[0]


def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    a = np.array(vec_a, dtype=np.float32)
    b = np.array(vec_b, dtype=np.float32)
    denom = (np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)
