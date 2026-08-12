"""Chat API endpoint — powers the AI assistant widget."""

from typing import List, Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.api.deps import DbSession
from app.services.chat_service import ChatService

router = APIRouter(tags=["chat"])


class ChatMessageIn(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1, max_length=2000)


class ChatRequest(BaseModel):
    messages: List[ChatMessageIn] = Field(min_length=1, max_length=20)
    job_id: Optional[int] = None


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest, db: DbSession) -> ChatResponse:
    """Send a message to the AI assistant and get a reply."""
    service = ChatService(db)
    messages = [{"role": m.role, "content": m.content} for m in payload.messages]
    reply = service.chat(messages, job_id=payload.job_id)
    return ChatResponse(reply=reply)
