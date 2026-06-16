import random
import string
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Otp, OtpType

OTP_EXPIRE_MINUTES = 10


def generate_otp(length: int = 6) -> str:
    """Generate a secure numeric OTP."""
    return "".join(random.choices(string.digits, k=length))


async def create_otp(db: AsyncSession, email: str, otp_type: OtpType) -> str:
    """
    Invalidate any previous unused OTPs for this email+type,
    then create and persist a new one. Returns the plain OTP code.
    """
    # Expire previous OTPs of the same type for this email
    await db.execute(
        update(Otp)
        .where(Otp.email == email, Otp.otp_type == otp_type, Otp.verified == False)
        .values(expires_at=datetime.now(timezone.utc))
    )

    code = generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRE_MINUTES)
    otp_record = Otp(email=email, otp_code=code, otp_type=otp_type, expires_at=expires_at)
    db.add(otp_record)
    await db.flush()
    return code


async def verify_otp(
    db: AsyncSession, email: str, code: str, otp_type: OtpType
) -> bool:
    """
    Return True and mark OTP verified if the code is valid and unexpired.
    Return False otherwise.
    """
    now = datetime.now(timezone.utc)
    result = await db.execute(
        select(Otp).where(
            Otp.email == email,
            Otp.otp_code == code,
            Otp.otp_type == otp_type,
            Otp.verified == False,
            Otp.expires_at > now,
        )
    )
    otp = result.scalar_one_or_none()
    if not otp:
        return False

    otp.verified = True
    await db.flush()
    return True


async def check_otp_verified(
    db: AsyncSession, email: str, otp_type: OtpType
) -> bool:
    """Return True if a verified OTP of the given type exists for this email."""
    result = await db.execute(
        select(Otp).where(
            Otp.email == email,
            Otp.otp_type == otp_type,
            Otp.verified == True,
        )
    )
    return result.scalar_one_or_none() is not None
