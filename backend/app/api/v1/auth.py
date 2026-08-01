from fastapi import APIRouter, status

from app.api.deps import AuthServiceDep
from app.schemas.auth import (
    AccessToken,
    ForgotPasswordRequest,
    LoginRequest,
    RefreshRequest,
    ResetPasswordRequest,
    TokenPair,
)
from app.schemas.common import Message
from app.schemas.user import UserCreate

router = APIRouter(tags=["auth"])


@router.post("/register", response_model=TokenPair, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, service: AuthServiceDep) -> TokenPair:
    return service.register(payload)


@router.post("/login", response_model=TokenPair)
def login(payload: LoginRequest, service: AuthServiceDep) -> TokenPair:
    return service.login(payload.email, payload.password)


@router.post("/refresh", response_model=AccessToken)
def refresh(payload: RefreshRequest, service: AuthServiceDep) -> AccessToken:
    return AccessToken(access_token=service.refresh(payload.refresh_token))


@router.post("/forgot-password", response_model=Message)
def forgot_password(payload: ForgotPasswordRequest, service: AuthServiceDep) -> Message:
    service.forgot_password(payload.email)
    return Message(detail="If that email exists, a reset link has been sent.")


@router.post("/reset-password", response_model=Message)
def reset_password(payload: ResetPasswordRequest, service: AuthServiceDep) -> Message:
    service.reset_password(payload.token, payload.new_password)
    return Message(detail="Password updated successfully.")
