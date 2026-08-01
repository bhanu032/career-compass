from fastapi import APIRouter

from app.api.v1 import admin, auth, bookmarks, jobs, profile

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(jobs.router)
api_router.include_router(bookmarks.router)
api_router.include_router(profile.router)
api_router.include_router(admin.router)
