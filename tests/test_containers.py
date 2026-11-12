from datetime import datetime
from typing import Dict

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete

from app.config import settings
from app.database import SessionLocal
from app.main import app
from app.migrate import upgrade_to_head
from app.models.container import Container

BASE_CONTAINER = {
    "container_number": "CONT-0001",
    "container_type": "40HC",
    "status": "available",
    "location": "yard-a",
    "condition": "good",
}

REQUIRED_FIELDS = (
    "container_number",
    "container_type",
    "status",
    "location",
    "condition",
)


def _clear_configured_containers() -> None:
    db = SessionLocal()
    try:
        db.execute(delete(Container))
        db.commit()
    finally:
        db.close()


def test_create_container(client: TestClient) -> None:
    payload = dict(BASE_CONTAINER)
    payload["notes"] = "inspection pending"

    response = client.post("/containers", json=payload)

    assert response.status_code == 201
    body = response.json()
    assert isinstance(body["id"], int)
    assert body["container_number"] == payload["container_number"]
    assert body["container_type"] == payload["container_type"]
    assert body["status"] == payload["status"]
    assert body["location"] == payload["location"]
    assert body["condition"] == payload["condition"]
    assert body["notes"] == payload["notes"]
    assert body["created_at"].endswith("Z")
    created_at = datetime.fromisoformat(body["created_at"].replace("Z", "+00:00"))
    assert created_at.utcoffset() is not None
    assert created_at.utcoffset().total_seconds() == 0


def test_list_containers(client: TestClient) -> None:
    empty = client.get("/containers")
    assert empty.status_code == 200
    assert empty.json() == []

    first = dict(BASE_CONTAINER)
    second = dict(BASE_CONTAINER)
    second["container_number"] = "CONT-0002"
    second["status"] = "rented"

    created_first = client.post("/containers", json=first)
    created_second = client.post("/containers", json=second)
    assert created_first.status_code == 201
    assert created_second.status_code == 201

    response = client.get("/containers")

    assert response.status_code == 200
    body = response.json()
    assert [item["container_number"] for item in body] == ["CONT-0001", "CONT-0002"]
    assert [item["id"] for item in body] == [
        created_first.json()["id"],
        created_second.json()["id"],
    ]


def test_get_container_by_id(client: TestClient) -> None:
    created = client.post("/containers", json=BASE_CONTAINER)
    assert created.status_code == 201
    container_id = created.json()["id"]

    response = client.get("/containers/{0}".format(container_id))

    assert response.status_code == 200
    assert response.json()["id"] == container_id
    assert response.json()["container_number"] == BASE_CONTAINER["container_number"]
    assert response.json()["notes"] is None


def test_get_missing_container_returns_404(client: TestClient) -> None:
    response = client.get("/containers/999999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Container not found"}


def test_duplicate_container_number_returns_409(client: TestClient) -> None:
    first = client.post("/containers", json=BASE_CONTAINER)
    duplicate = client.post("/containers", json=BASE_CONTAINER)

    assert first.status_code == 201
    assert duplicate.status_code == 409
    assert duplicate.json()["detail"] == (
        "A container with this container_number already exists"
    )

    listed = client.get("/containers")
    assert listed.status_code == 200
    assert len(listed.json()) == 1


@pytest.mark.parametrize("field", REQUIRED_FIELDS)
def test_missing_required_field_returns_422(client: TestClient, field: str) -> None:
    payload: Dict[str, str] = dict(BASE_CONTAINER)
    payload.pop(field)

    response = client.post("/containers", json=payload)

    assert response.status_code == 422
    locations = [tuple(error["loc"]) for error in response.json()["detail"]]
    assert ("body", field) in locations


@pytest.mark.parametrize("field", REQUIRED_FIELDS)
def test_blank_required_field_returns_422(client: TestClient, field: str) -> None:
    payload: Dict[str, str] = dict(BASE_CONTAINER)
    payload[field] = "   "

    response = client.post("/containers", json=payload)

    assert response.status_code == 422
    locations = [tuple(error["loc"]) for error in response.json()["detail"]]
    assert ("body", field) in locations


def test_unknown_status_returns_422(client: TestClient) -> None:
    payload = dict(BASE_CONTAINER)
    payload["status"] = "scrapped"

    response = client.post("/containers", json=payload)

    assert response.status_code == 422


def test_suite_does_not_use_the_development_database() -> None:
    assert not settings.database_url.endswith("database/app.db")


def test_roundtrip_on_configured_sqlite() -> None:
    app.dependency_overrides.clear()
    upgrade_to_head(settings.database_url)
    _clear_configured_containers()
    payload = dict(BASE_CONTAINER)
    payload["container_number"] = "CONT-REAL-1"
    try:
        with TestClient(app) as test_client:
            health = test_client.get("/health")
            assert health.status_code == 200
            assert health.json() == {"status": "ok", "version": "0.1.0"}

            created = test_client.post("/containers", json=payload)
            assert created.status_code == 201
            container_id = created.json()["id"]

            fetched = test_client.get("/containers/{0}".format(container_id))
            assert fetched.status_code == 200
            assert fetched.json()["container_number"] == "CONT-REAL-1"
    finally:
        _clear_configured_containers()
