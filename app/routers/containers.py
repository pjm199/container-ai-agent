"""Container HTTP endpoints."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.container import Container
from app.schemas.container import ContainerCreate, ContainerRead

router = APIRouter(prefix="/containers", tags=["containers"])


def _integrity_error(exc: IntegrityError) -> HTTPException:
    message = str(exc.orig).lower() if exc.orig is not None else str(exc).lower()
    if "unique" in message or "container_number" in message:
        return HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A container with this container_number already exists",
        )
    return HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="Container data violates a database constraint",
    )


@router.post("", response_model=ContainerRead, status_code=status.HTTP_201_CREATED)
def create_container(
    payload: ContainerCreate,
    db: Session = Depends(get_db),
) -> Container:
    container = Container(
        container_number=payload.container_number,
        container_type=payload.container_type,
        status=payload.status.value,
        location=payload.location,
        condition=payload.condition,
        notes=payload.notes,
    )
    db.add(container)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise _integrity_error(exc) from exc
    db.refresh(container)
    return container


@router.get("", response_model=List[ContainerRead])
def list_containers(db: Session = Depends(get_db)) -> List[Container]:
    return list(db.scalars(select(Container).order_by(Container.id)).all())


@router.get("/{container_id}", response_model=ContainerRead)
def get_container(container_id: int, db: Session = Depends(get_db)) -> Container:
    container = db.get(Container, container_id)
    if container is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found",
        )
    return container
