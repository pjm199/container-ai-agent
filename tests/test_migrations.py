"""Alembic checks against temporary SQLite files.

These tests must not open ``database/app.db``.
"""

import os
from datetime import datetime, timezone

from alembic import command
from alembic.autogenerate import compare_metadata
from alembic.runtime.migration import MigrationContext
from alembic.script import ScriptDirectory
from sqlalchemy import inspect, select

from app.config import settings
from app.database import Base, create_db_engine, create_session_factory
from app.migrate import (
    current_revision,
    head_revision,
    make_config,
    stamp_head,
    upgrade_to_head,
)
from app.models.container import Container


def _url(tmp_path: object) -> str:
    return "sqlite:///" + os.path.join(str(tmp_path), "migration.db")


def _metadata_diff(url: str) -> list:
    engine = create_db_engine(url)
    try:
        with engine.connect() as connection:
            context = MigrationContext.configure(
                connection,
                opts={
                    "compare_type": True,
                    "compare_server_default": True,
                    "render_as_batch": True,
                    "target_metadata": Base.metadata,
                },
            )
            return compare_metadata(context, Base.metadata)
    finally:
        engine.dispose()


def test_alembic_configuration_is_valid() -> None:
    cfg = make_config()
    script_location = cfg.get_main_option("script_location")
    assert script_location is not None
    assert os.path.isfile(os.path.join(script_location, "env.py"))

    script = ScriptDirectory.from_config(cfg)
    heads = script.get_heads()
    assert heads == [head_revision()]
    base = script.get_revision(heads[0])
    assert base is not None
    assert base.down_revision is None

    with open("alembic.ini", encoding="utf-8") as handle:
        ini = handle.read()
    assert "driver://user:pass@localhost/dbname" not in ini
    assert "database/app.db" not in ini


def test_database_url_comes_from_application_settings() -> None:
    assert make_config().get_main_option("sqlalchemy.url") == settings.database_url
    assert not settings.database_url.endswith("database/app.db")


def test_empty_database_upgrades_to_head(tmp_path: object) -> None:
    url = _url(tmp_path)
    assert current_revision(url) is None

    upgrade_to_head(url)

    assert current_revision(url) == head_revision()
    engine = create_db_engine(url)
    try:
        inspector = inspect(engine)
        assert "containers" in inspector.get_table_names()
        columns = {column["name"] for column in inspector.get_columns("containers")}
    finally:
        engine.dispose()
    assert columns == {
        "id",
        "container_number",
        "container_type",
        "status",
        "location",
        "condition",
        "notes",
        "created_at",
    }


def test_existing_records_survive_baseline_stamp(tmp_path: object) -> None:
    url = _url(tmp_path)
    engine = create_db_engine(url)
    factory = create_session_factory(engine)
    Base.metadata.create_all(bind=engine)
    created_at = datetime(2026, 1, 2, 3, 4, 5, tzinfo=timezone.utc)
    with factory() as session:
        session.add(
            Container(
                container_number="CONT-KEEP-1",
                container_type="40HC",
                status="available",
                location="yard-a",
                condition="good",
                notes="keep me",
                created_at=created_at,
            )
        )
        session.commit()

    assert _metadata_diff(url) == []

    stamp_head(url)
    upgrade_to_head(url)

    with factory() as session:
        row = session.scalars(select(Container)).one()
        assert row.container_number == "CONT-KEEP-1"
        assert row.container_type == "40HC"
        assert row.status == "available"
        assert row.location == "yard-a"
        assert row.condition == "good"
        assert row.notes == "keep me"
        assert row.created_at == created_at
    assert current_revision(url) == head_revision()
    engine.dispose()


def test_migrated_schema_matches_sqlalchemy_models(tmp_path: object) -> None:
    url = _url(tmp_path)
    upgrade_to_head(url)
    assert _metadata_diff(url) == []


def test_downgrade_one_revision_removes_the_baseline_table(tmp_path: object) -> None:
    url = _url(tmp_path)
    upgrade_to_head(url)
    command.downgrade(make_config(url), "-1")

    assert current_revision(url) is None
    engine = create_db_engine(url)
    try:
        assert "containers" not in inspect(engine).get_table_names()
    finally:
        engine.dispose()
