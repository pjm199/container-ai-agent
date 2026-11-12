"""Point the app database at a throwaway file before the app is imported.

The development file ``database/app.db`` must stay untouched. Each test still
receives its own database through the ``client`` fixture.
"""

import atexit
import os
import shutil
import tempfile
from typing import Generator

_PYTEST_DB_DIR = tempfile.mkdtemp(prefix="container-ai-pytest-")
os.environ["DATABASE_URL"] = "sqlite:///" + os.path.join(_PYTEST_DB_DIR, "session.db")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.database import Base, create_db_engine, create_session_factory, get_db
from app.main import app

atexit.register(lambda: shutil.rmtree(_PYTEST_DB_DIR, ignore_errors=True))

_DEV_DB = os.path.abspath(os.path.join("database", "app.db"))


@pytest.fixture(scope="session", autouse=True)
def development_database_untouched() -> Generator[None, None, None]:
    """Fail if the suite creates or rewrites database/app.db."""
    existed = os.path.exists(_DEV_DB)
    before = os.stat(_DEV_DB).st_mtime_ns if existed else None
    yield
    if existed:
        assert os.path.exists(_DEV_DB)
        assert os.stat(_DEV_DB).st_mtime_ns == before
    else:
        assert not os.path.exists(_DEV_DB)


@pytest.fixture()
def client(tmp_path: object) -> Generator[TestClient, None, None]:
    database_path = os.path.join(str(tmp_path), "containers.db")
    test_engine = create_db_engine("sqlite:///" + database_path)
    session_factory = create_session_factory(test_engine)
    Base.metadata.create_all(bind=test_engine)

    def override_get_db() -> Generator[Session, None, None]:
        db = session_factory()
        try:
            yield db
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()
        Base.metadata.drop_all(bind=test_engine)
        test_engine.dispose()
