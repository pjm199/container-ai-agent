"""SQLite engine, sessions, and schema creation."""

import os
from typing import Any, Generator

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine, make_url
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings


class Base(DeclarativeBase):
    pass


def create_db_engine(url: str, **kwargs: Any) -> Engine:
    """Create an engine. SQLite connections may be reused across FastAPI threads."""
    connect_args = {"check_same_thread": False} if url.startswith("sqlite") else {}
    connect_args.update(kwargs.pop("connect_args", {}))
    return create_engine(url, connect_args=connect_args, **kwargs)


def create_session_factory(engine: Engine) -> sessionmaker:
    return sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
        expire_on_commit=False,
    )


def ensure_sqlite_parent_dir(url: str) -> None:
    database = make_url(url).database
    if not database or database == ":memory:":
        return
    parent = os.path.dirname(os.path.abspath(database))
    if parent:
        os.makedirs(parent, exist_ok=True)


engine = create_db_engine(settings.database_url)
SessionLocal = create_session_factory(engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db() -> None:
    """Ensure the SQLite directory exists.

    Schema changes are applied with Alembic, not during startup. Startup does
    not upgrade, downgrade, or reset the database.
    """
    ensure_sqlite_parent_dir(settings.database_url)
