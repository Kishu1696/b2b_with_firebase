from functools import wraps
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import verify_access_token
from app.database.session import get_db
from app.models.models import User, UserRole

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    FastAPI dependency — extracts and validates the Bearer token,
    then fetches and returns the current user.
    Raises 401 if missing/invalid, 403 if inactive.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not credentials:
        raise credentials_exception

    user_id = verify_access_token(credentials.credentials)
    if not user_id:
        raise credentials_exception

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated.")
    return user


# ─── Role-based dependency factories ─────────────────────────────────────────

def require_role(*roles: UserRole):
    """
    Returns a FastAPI dependency that asserts the current user has one of the given roles.
    Usage:  current_user: User = Depends(require_role(UserRole.admin))
    """
    async def _check(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access restricted to: {', '.join(r.value for r in roles)}.",
            )
        return user
    return _check


# Convenience aliases
admin_only = require_role(UserRole.admin)
seller_only = require_role(UserRole.seller)
buyer_only = require_role(UserRole.buyer)
manager_only = require_role(UserRole.manager)
admin_or_manager = require_role(UserRole.admin, UserRole.manager)
