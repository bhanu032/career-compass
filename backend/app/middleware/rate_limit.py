import time
from collections import defaultdict, deque
from typing import Deque, Dict

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Simple in-memory sliding-window rate limiter (per client IP)."""

    def __init__(self, app, max_requests: int = 120, window_seconds: int = 60) -> None:
        super().__init__(app)
        self.max_requests = max_requests
        self.window = window_seconds
        self.hits: Dict[str, Deque[float]] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        client = request.client.host if request.client else "unknown"
        now = time.time()
        bucket = self.hits[client]
        while bucket and now - bucket[0] > self.window:
            bucket.popleft()
        if len(bucket) >= self.max_requests:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please slow down."},
            )
        bucket.append(now)
        return await call_next(request)
