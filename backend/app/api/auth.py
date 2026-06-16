from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.models import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    LogoutRequest,
    MessageResponse,
    RefreshTokenRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserOut,
    VerifyEmailRequest,
    VerifyResetOtpRequest,
)
from app.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user and send an email verification OTP."""
    try:
        await auth_service.register_user(db, body)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc))
    return {"message": "Registration successful. Check your email to verify your account."}


@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(body: VerifyEmailRequest, db: AsyncSession = Depends(get_db)):
    """Verify email address using the OTP code."""
    try:
        await auth_service.verify_email(db, body.email, body.otp)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return {"message": "Email verified successfully. You can now log in."}


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate and return JWT access + refresh tokens."""
    try:
        access_token, refresh_token, user = await auth_service.authenticate_user(
            db, body.email, body.password
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc))
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserOut.model_validate(user),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    """Rotate refresh token and issue a new access token."""
    try:
        access_token, new_refresh, user = await auth_service.refresh_access_token(
            db, body.refresh_token
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc))
    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh,
        user=UserOut.model_validate(user),
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(body: LogoutRequest, db: AsyncSession = Depends(get_db)):
    """Invalidate the given refresh token."""
    await auth_service.logout_user(db, body.refresh_token)
    return {"message": "Logged out successfully."}


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(body: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Send a password-reset OTP if the email is registered."""
    await auth_service.forgot_password(db, body.email)
    return {"message": "If that email is registered, a reset code has been sent."}


@router.post("/verify-reset-otp", response_model=MessageResponse)
async def verify_reset_otp(body: VerifyResetOtpRequest, db: AsyncSession = Depends(get_db)):
    """Validate the password-reset OTP."""
    try:
        await auth_service.verify_reset_otp(db, body.email, body.otp)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return {"message": "OTP verified. You may now reset your password."}


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(body: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Reset the user's password after OTP verification."""
    try:
        await auth_service.reset_password(db, body.email, body.otp, body.new_password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return {"message": "Password reset successfully. You can now log in."}


@router.get("/me", response_model=UserOut)
async def me(current_user: Annotated[User, Depends(get_current_user)]):
    """Return the authenticated user's profile."""
    return current_user
