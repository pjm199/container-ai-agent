"""Explicit Alembic commands.

Application startup does not apply migrations. Use these helpers, or the
Alembic CLI from the repository root, against a chosen database URL.
"""

import os
from typing import Optional

from alembic import command
from alembic.config import Config
from alembic.runtime.migration import MigrationContext
from alembic.script import ScriptDirectory

from app.config import settings
from app.database import create_db_engine

_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))


def make_config(database_url: Optional[str] = None) -> Config:
    cfg = Config(os.path.join(_ROOT, "alembic.ini"))
    cfg.set_main_option("script_location", os.path.join(_ROOT, "migrations"))
    url = settings.database_url if database_url is None else database_url
    cfg.set_main_option("sqlalchemy.url", url.replace("%", "%%"))
    return cfg


def head_revision() -> str:
    head = ScriptDirectory.from_config(make_config()).get_current_head()
    if head is None:
        raise RuntimeError("Alembic has no head revision")
    return head


def current_revision(database_url: str) -> Optional[str]:
    engine = create_db_engine(database_url)
    try:
        with engine.connect() as connection:
            context = MigrationContext.configure(connection)
            return context.get_current_revision()
    finally:
        engine.dispose()


def upgrade_to_head(database_url: Optional[str] = None) -> None:
    command.upgrade(make_config(database_url), "head")


def stamp_head(database_url: Optional[str] = None) -> None:
    """Record the head revision without running migrations."""
    command.stamp(make_config(database_url), "head")
