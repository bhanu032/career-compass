from fastapi import APIRouter

from app.api.deps import CurrentUser, DbSession
from app.schemas.user import UserRead, UserUpdate

router = APIRouter(tags=["profile"], prefix="/profile")


@router.get("", response_model=UserRead)
def get_profile(user: CurrentUser) -> UserRead:
    return UserRead.model_validate(user)


@router.put("", response_model=UserRead)
def update_profile(payload: UserUpdate, user: CurrentUser, db: DbSession) -> UserRead:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return UserRead.model_validate(user)
