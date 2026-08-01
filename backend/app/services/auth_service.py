from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    RESET_TOKEN,
    create_access_token,
    create_refresh_token,
    create_reset_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository
from app.schemas.auth import TokenPair
from app.schemas.user import UserCreate, UserRead
from app.services.email_service import EmailService


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.users = UserRepository(db)
        self.email = EmailService()

    def register(self, payload: UserCreate) -> TokenPair:
        if self.users.get_by_email(payload.email):
            raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")

        user = User(
            full_name=payload.full_name,
            email=payload.email.lower(),
            hashed_password=hash_password(payload.password),
            phone=payload.phone,
            state=payload.state,
            qualification=payload.qualification,
            role=UserRole.USER,
        )
        self.users.add(user)
        self.users.commit()
        self.db.refresh(user)
        return self._tokens(user)

    def login(self, email: str, password: str) -> TokenPair:
        user = self.users.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
        if not user.is_active:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "This account has been deactivated")
        return self._tokens(user)

    def refresh(self, refresh_token: str) -> str:
        payload = decode_token(refresh_token, expected_type="refresh")
        if not payload:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired refresh token")
        user = self.users.get(int(payload["sub"]))
        if not user or not user.is_active:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User no longer active")
        return create_access_token(str(user.id), user.role.value)

    def forgot_password(self, email: str) -> None:
        user = self.users.get_by_email(email)
        if not user:
            return  # never disclose whether an account exists
        token = create_reset_token(str(user.id))
        self.email.send_password_reset(user.email, token)

    def reset_password(self, token: str, new_password: str) -> None:
        payload = decode_token(token, expected_type=RESET_TOKEN)
        if not payload:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired reset token")
        user = self.users.get(int(payload["sub"]))
        if not user:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
        user.hashed_password = hash_password(new_password)
        self.users.commit()

    def _tokens(self, user: User) -> TokenPair:
        return TokenPair(
            access_token=create_access_token(str(user.id), user.role.value),
            refresh_token=create_refresh_token(str(user.id)),
            user=UserRead.model_validate(user),
        )
