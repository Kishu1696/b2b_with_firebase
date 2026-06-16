from datetime import datetime, timezone

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, create_refresh_token, verify_refresh_token
from app.models.models import OtpType, RefreshToken, User, UserRole
from app.schemas.auth import RegisterRequest
from app.services.email_service import send_password_reset_email, send_verification_email
from app.services.otp_service import check_otp_verified, create_otp, verify_otp
from app.utils.password import hash_password, verify_password


async def register_user(db: AsyncSession, data: RegisterRequest) -> None:
    """Create a new user and dispatch a verification OTP email."""
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise ValueError("An account with this email already exists.")

    user = User(
        full_name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password),
        company_name=data.company_name,
        role=data.role,
    )
    db.add(user)
    await db.flush()

    otp = await create_otp(db, data.email, OtpType.email_verification)
    await send_verification_email(data.email, otp)


async def verify_email(db: AsyncSession, email: str, code: str) -> User:
    """Verify the email OTP and activate the user account."""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise ValueError("User not found.")
    if user.is_verified:
        raise ValueError("Account is already verified.")

    valid = await verify_otp(db, email, code, OtpType.email_verification)
    if not valid:
        raise ValueError("Invalid or expired OTP.")

    user.is_verified = True
    await db.flush()
    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> tuple[str, str, User]:
    """Validate credentials and return (access_token, refresh_token, user)."""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(password, user.password_hash):
        raise ValueError("Invalid email or password.")
    if not user.is_verified:
        raise ValueError("Please verify your email before logging in.")
    if not user.is_active:
        raise ValueError("Your account has been deactivated.")

    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token_str, expires_at = create_refresh_token({"sub": str(user.id)})

    db_token = RefreshToken(
        user_id=user.id, token=refresh_token_str, expires_at=expires_at
    )
    db.add(db_token)
    await db.flush()

    return access_token, refresh_token_str, user


async def refresh_access_token(db: AsyncSession, token: str) -> tuple[str, str, User]:
    """
    Validate and rotate a refresh token.
    Returns new (access_token, refresh_token, user).
    """
    user_id = verify_refresh_token(token)
    if not user_id:
        raise ValueError("Invalid or expired refresh token.")

    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token == token,
            RefreshToken.expires_at > datetime.now(timezone.utc),
        )
    )
    db_token = result.scalar_one_or_none()
    if not db_token:
        raise ValueError("Refresh token not found or expired.")

    # Rotate — delete old token
    await db.delete(db_token)

    user_result = await db.execute(select(User).where(User.id == db_token.user_id))
    user = user_result.scalar_one_or_none()
    if not user or not user.is_active:
        raise ValueError("User not found or inactive.")

    new_access = create_access_token({"sub": str(user.id), "role": user.role})
    new_refresh, expires_at = create_refresh_token({"sub": str(user.id)})

    db.add(RefreshToken(user_id=user.id, token=new_refresh, expires_at=expires_at))
    await db.flush()

    return new_access, new_refresh, user


async def logout_user(db: AsyncSession, token: str) -> None:
    """Invalidate a refresh token."""
    await db.execute(delete(RefreshToken).where(RefreshToken.token == token))


async def forgot_password(db: AsyncSession, email: str) -> None:
    """Send a password-reset OTP if the email exists. Always succeeds silently."""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        return  # Don't reveal whether the email exists

    otp = await create_otp(db, email, OtpType.password_reset)
    await send_password_reset_email(email, otp)


async def verify_reset_otp(db: AsyncSession, email: str, code: str) -> None:
    """Validate a password-reset OTP without consuming it for reset yet."""
    valid = await verify_otp(db, email, code, OtpType.password_reset)
    if not valid:
        raise ValueError("Invalid or expired OTP.")


async def reset_password(db: AsyncSession, email: str, otp_code: str, new_password: str) -> None:
    """Verify OTP and update the user's password."""
    has_verified = await check_otp_verified(db, email, OtpType.password_reset)
    if not has_verified:
        raise ValueError("OTP not verified. Please verify the OTP first.")

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise ValueError("User not found.")

    user.password_hash = hash_password(new_password)
    await db.flush()
