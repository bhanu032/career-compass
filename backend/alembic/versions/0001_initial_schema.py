"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-01-01
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

user_role = sa.Enum("ADMIN", "USER", name="user_role", create_type=False)
scraper_status = sa.Enum("SUCCESS", "FAILED", "PARTIAL", name="scraper_status", create_type=False)


def upgrade() -> None:
    bind = op.get_bind()
    # PostgreSQL needs explicit ENUM types; SQLite uses plain VARCHAR
    if bind.dialect.name == "postgresql":
        bind.execute(sa.text("DO $$ BEGIN CREATE TYPE user_role AS ENUM ('ADMIN', 'USER'); EXCEPTION WHEN duplicate_object THEN null; END $$"))
        bind.execute(sa.text("DO $$ BEGIN CREATE TYPE scraper_status AS ENUM ('SUCCESS', 'FAILED', 'PARTIAL'); EXCEPTION WHEN duplicate_object THEN null; END $$"))

    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("full_name", sa.String(120), nullable=False),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(20)),
        sa.Column("state", sa.String(80)),
        sa.Column("qualification", sa.String(120)),
        sa.Column("role", sa.String(10), nullable=False, server_default="USER"),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "jobs",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("organization", sa.String(200), nullable=False),
        sa.Column("department", sa.String(200)),
        sa.Column("state", sa.String(80)),
        sa.Column("city", sa.String(80)),
        sa.Column("qualification", sa.String(300)),
        sa.Column("category", sa.String(120)),
        sa.Column("salary", sa.String(160)),
        sa.Column("salary_min", sa.Integer),
        sa.Column("salary_max", sa.Integer),
        sa.Column("age_limit", sa.String(120)),
        sa.Column("application_mode", sa.String(60)),
        sa.Column("application_url", sa.String(600)),
        sa.Column("notification_pdf", sa.String(600)),
        sa.Column("last_date", sa.Date),
        sa.Column("published_date", sa.Date),
        sa.Column("description", sa.Text),
        sa.Column("selection_process", sa.Text),
        sa.Column("vacancies", sa.Integer),
        sa.Column("experience", sa.String(160)),
        sa.Column("job_type", sa.String(80)),
        sa.Column("source", sa.String(80)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("title", "organization", "last_date", name="uq_job_identity"),
    )
    for column in ("title", "organization", "state", "qualification", "category", "last_date", "published_date", "job_type", "source", "salary_min", "salary_max"):
        op.create_index(f"ix_jobs_{column}", "jobs", [column])
    op.create_index("ix_jobs_search", "jobs", ["title", "organization"])
    op.create_index("ix_jobs_state_category", "jobs", ["state", "category"])

    op.create_table(
        "bookmarks",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("job_id", sa.Integer, sa.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", "job_id", name="uq_bookmark_user_job"),
    )
    op.create_index("ix_bookmarks_user_id", "bookmarks", ["user_id"])
    op.create_index("ix_bookmarks_job_id", "bookmarks", ["job_id"])

    op.create_table(
        "scraper_logs",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("source", sa.String(80), nullable=False),
        sa.Column("status", sa.String(10), nullable=False),
        sa.Column("items_found", sa.Integer, server_default="0"),
        sa.Column("items_created", sa.Integer, server_default="0"),
        sa.Column("items_updated", sa.Integer, server_default="0"),
        sa.Column("duration_ms", sa.Integer, server_default="0"),
        sa.Column("message", sa.Text),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("finished_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_scraper_logs_source", "scraper_logs", ["source"])


def downgrade() -> None:
    op.drop_table("scraper_logs")
    op.drop_table("bookmarks")
    op.drop_table("jobs")
    op.drop_table("users")
    bind = op.get_bind()
    scraper_status.drop(bind, checkfirst=True)
    user_role.drop(bind, checkfirst=True)
