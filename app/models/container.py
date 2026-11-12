"""Container table."""

import enum
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import CheckConstraint, DateTime, Integer, String, TypeDecorator
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ContainerStatus(str, enum.Enum):
    available = "available"
    rented = "rented"
    in_transit = "in_transit"
    maintenance = "maintenance"
    sold = "sold"


def _status_check_sql() -> str:
    allowed = ", ".join("'{0}'".format(status.value) for status in ContainerStatus)
    return "status IN ({0})".format(allowed)


class UtcDateTime(TypeDecorator):
    """UTC timestamps. SQLite gives them back without timezone info."""

    impl = DateTime(timezone=True)
    cache_ok = True

    def process_bind_param(self, value: Optional[datetime], dialect: object) -> Optional[datetime]:
        if value is None:
            return None
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc)

    def process_result_value(self, value: Optional[datetime], dialect: object) -> Optional[datetime]:
        if value is None:
            return None
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc)


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Container(Base):
    __tablename__ = "containers"
    __table_args__ = (
        CheckConstraint(_status_check_sql(), name="ck_containers_status"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    container_number: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    container_type: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[str] = mapped_column(String, nullable=False)
    condition: Mapped[str] = mapped_column(String, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        UtcDateTime(),
        nullable=False,
        default=utcnow,
    )
