from src.core.entities_registry import register_entities
from src.core.database import engine
from sqlalchemy import text
from pathlib import Path

register_entities()

with engine.connect() as conn:
    for f in sorted(Path("/scripts").glob("*.sql")):
        conn.execute(text(f.read_text()))
        conn.commit()
