"""Pydantic payloads for the container API."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.container import ContainerStatus


class ContainerCreate(BaseModel):
    container_number: str = Field(min_length=1)
    container_type: str = Field(min_length=1)
    status: ContainerStatus
    location: str = Field(min_length=1)
    condition: str = Field(min_length=1)
    notes: Optional[str] = None

    @field_validator(
        "container_number",
        "container_type",
        "location",
        "condition",
        mode="before",
    )
    @classmethod
    def strip_required_text(cls, value: object) -> object:
        if isinstance(value, str):
            return value.strip()
        return value

    @field_validator("notes", mode="before")
    @classmethod
    def blank_notes_to_none(cls, value: object) -> object:
        if value is None or not isinstance(value, str):
            return value
        stripped = value.strip()
        return stripped or None


class ContainerRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    container_number: str
    container_type: str
    status: ContainerStatus
    location: str
    condition: str
    notes: Optional[str] = None
    created_at: datetime
