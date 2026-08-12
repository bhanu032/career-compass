from fastapi import APIRouter

from app.api.v1 import admin, auth, bookmarks, chat, jobs, profile, resume

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(jobs.router)
api_router.include_router(bookmarks.router)
api_router.include_router(profile.router)
api_router.include_router(admin.router)
api_router.include_router(chat.router)
api_router.include_router(resume.router)
