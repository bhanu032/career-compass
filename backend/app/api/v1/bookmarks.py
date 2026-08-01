from typing import Annotated, List

from fastapi import APIRouter, Query, status

from app.api.deps import BookmarkServiceDep, CurrentUser
from app.schemas.common import Message, Page
from app.schemas.job import JobRead

router = APIRouter(tags=["bookmarks"], prefix="/bookmarks")


@router.get("", response_model=Page[JobRead])
def list_bookmarks(
    user: CurrentUser,
    service: BookmarkServiceDep,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 12,
) -> Page[JobRead]:
    rows, total = service.list(user.id, page, page_size)
    return Page[JobRead](
        items=[JobRead.model_validate(b.job) for b in rows],
        total=total,
        page=page,
        page_size=page_size,
        pages=max(1, -(-total // page_size)),
    )


@router.get("/ids", response_model=List[int])
def bookmark_ids(user: CurrentUser, service: BookmarkServiceDep) -> List[int]:
    return service.job_ids(user.id)


@router.post("/{job_id}", response_model=Message, status_code=status.HTTP_201_CREATED)
def add_bookmark(job_id: int, user: CurrentUser, service: BookmarkServiceDep) -> Message:
    service.add(user.id, job_id)
    return Message(detail="Job bookmarked")


@router.delete("/{job_id}", response_model=Message)
def remove_bookmark(job_id: int, user: CurrentUser, service: BookmarkServiceDep) -> Message:
    service.remove(user.id, job_id)
    return Message(detail="Bookmark removed")
