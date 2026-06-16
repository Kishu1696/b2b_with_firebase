import logging
from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


def _verification_html(otp: str) -> str:
    return f"""
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0f1117;color:#e2e8f0;padding:32px;border-radius:12px;">
      <h2 style="color:#6366f1;margin-bottom:8px;">LiquidFlow AI</h2>
      <p style="color:#94a3b8;font-size:14px;margin-bottom:24px;">Enterprise liquidation intelligence</p>
      <h3 style="margin-bottom:16px;">Verify your email address</h3>
      <p style="color:#94a3b8;">Use the code below to verify your account. It expires in <strong>10 minutes</strong>.</p>
      <div style="background:#1e2332;border:1px solid #2d3655;border-radius:8px;text-align:center;padding:24px;margin:24px 0;">
        <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#6366f1;">{otp}</span>
      </div>
      <p style="color:#64748b;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
    """


def _password_reset_html(otp: str) -> str:
    return f"""
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0f1117;color:#e2e8f0;padding:32px;border-radius:12px;">
      <h2 style="color:#6366f1;margin-bottom:8px;">LiquidFlow AI</h2>
      <p style="color:#94a3b8;font-size:14px;margin-bottom:24px;">Enterprise liquidation intelligence</p>
      <h3 style="margin-bottom:16px;">Reset your password</h3>
      <p style="color:#94a3b8;">Use the code below to reset your password. It expires in <strong>10 minutes</strong>.</p>
      <div style="background:#1e2332;border:1px solid #2d3655;border-radius:8px;text-align:center;padding:24px;margin:24px 0;">
        <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#6366f1;">{otp}</span>
      </div>
      <p style="color:#64748b;font-size:12px;">If you didn't request this, please secure your account immediately.</p>
    </div>
    """


async def send_verification_email(email: str, otp: str) -> None:
    """Send OTP verification email via Resend."""
    await _send(
        to=email,
        subject="Your LiquidFlow AI verification code",
        html=_verification_html(otp),
    )


async def send_password_reset_email(email: str, otp: str) -> None:
    """Send password-reset OTP email via Resend."""
    await _send(
        to=email,
        subject="Reset your LiquidFlow AI password",
        html=_password_reset_html(otp),
    )


async def _send(to: str, subject: str, html: str) -> None:
    """Internal helper — sends via Resend SDK or logs in dev mode."""
    if not settings.RESEND_API_KEY or settings.ENVIRONMENT == "development":
        logger.info("[DEV] Would send email to=%s subject=%s html=%s", to, subject, html[:80])
        return

    try:
        import resend  # type: ignore

        resend.api_key = settings.RESEND_API_KEY
        resend.Emails.send(
            {
                "from": f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>",
                "to": [to],
                "subject": subject,
                "html": html,
            }
        )
    except Exception as exc:
        logger.error("Failed to send email to %s: %s", to, exc)
        raise
