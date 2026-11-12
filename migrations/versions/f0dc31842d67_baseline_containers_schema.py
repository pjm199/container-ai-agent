"""baseline containers schema

Revision ID: f0dc31842d67
Revises:
Create Date: 2026-11-12 00:04:10.188161

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f0dc31842d67'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create the containers table."""
    op.create_table(
        "containers",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("container_number", sa.String(), nullable=False),
        sa.Column("container_type", sa.String(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("location", sa.String(), nullable=False),
        sa.Column("condition", sa.String(), nullable=False),
        sa.Column("notes", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint(
            "status IN ('available', 'rented', 'in_transit', 'maintenance', 'sold')",
            name="ck_containers_status",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("container_number"),
    )


def downgrade() -> None:
    """Drop the containers table."""
    op.drop_table("containers")
