from contextlib import asynccontextmanager
from typing import AsyncIterator, Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logging_config import configure_logging, get_logger
from app.core.security import hash_password
from app.database.session import SessionLocal
from app.middleware.error_handler import register_exception_handlers
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_logging import RequestLoggingMiddleware
from app.models.user import User, UserRole
from app.scheduler import start_scheduler, stop_scheduler

configure_logging()
logger = get_logger("app")


def _seed_admin() -> None:
    """Create the first admin account if it doesn't exist yet."""
    db = SessionLocal()
    try:
        exists = db.query(User).filter(User.email == settings.FIRST_ADMIN_EMAIL.lower()).first()
        if not exists:
            admin = User(
                full_name="Admin",
                email=settings.FIRST_ADMIN_EMAIL.lower(),
                hashed_password=hash_password(settings.FIRST_ADMIN_PASSWORD),
                role=UserRole.ADMIN,
                is_active=True,
            )
            db.add(admin)
            db.commit()
            logger.info("Admin account created: %s", settings.FIRST_ADMIN_EMAIL)
    except Exception as exc:
        logger.warning("Could not seed admin: %s", exc)
    finally:
        db.close()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    logger.info("Starting %s", settings.PROJECT_NAME)
    _seed_admin()
    start_scheduler()
    yield
    stop_scheduler()
    logger.info("Shutdown complete")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="REST API powering the GovJobs Portal.",
    docs_url="/docs",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RateLimitMiddleware, max_requests=240, window_seconds=60)

register_exception_handlers(app)
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/health", tags=["system"])
def health() -> Dict[str, str]:
    return {"status": "ok", "service": settings.PROJECT_NAME}
