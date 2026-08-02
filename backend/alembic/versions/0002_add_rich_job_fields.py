"""add rich job detail fields (important_dates, application_fee, vacancy_details, important_links)

Revision ID: 0002
Revises: 0001
Create Date: 2026-08-02
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Store structured data as JSON text columns
    op.add_column("jobs", sa.Column("important_dates", sa.Text, nullable=True))
    op.add_column("jobs", sa.Column("application_fee", sa.Text, nullable=True))
    op.add_column("jobs", sa.Column("vacancy_details", sa.Text, nullable=True))
    op.add_column("jobs", sa.Column("important_links", sa.Text, nullable=True))
    op.add_column("jobs", sa.Column("how_to_apply", sa.Text, nullable=True))
    op.add_column("jobs", sa.Column("short_info", sa.Text, nullable=True))


def downgrade() -> None:
    op.drop_column("jobs", "short_info")
    op.drop_column("jobs", "how_to_apply")
    op.drop_column("jobs", "important_links")
    op.drop_column("jobs", "vacancy_details")
    op.drop_column("jobs", "application_fee")
    op.drop_column("jobs", "important_dates")
