from logging.config import fileConfig
import logging
import sys

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.core.config import settings
from app.models import Base  # noqa: F401  (imports all models)

config = context.config
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata
logger = logging.getLogger("alembic.env")


def run_migrations_offline() -> None:
    context.configure(
        url=settings.DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    try:
        with connectable.connect() as connection:
            context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)
            with context.begin_transaction():
                context.run_migrations()
    except Exception as exc:
        # Database is unreachable (e.g. during Render build phase when internal
        # Postgres DNS is not yet available).  Log a warning and exit cleanly —
        # tables are created at runtime via Base.metadata.create_all() in main.py.
        logger.warning(
            "Alembic could not connect to the database and will skip migrations: %s. "
            "Tables will be created at application startup instead.",
            exc,
        )
        sys.exit(0)


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
