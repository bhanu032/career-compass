import smtplib
from email.message import EmailMessage

from app.core.config import settings
from app.core.logging_config import get_logger

logger = get_logger("email")


class EmailService:
    """Sends transactional email; logs to stdout when SMTP is not configured."""

    def send(self, to: str, subject: str, body: str) -> None:
        if not settings.SMTP_HOST:
            logger.info("[EMAIL:dev] to=%s subject=%s\n%s", to, subject, body)
            return
        message = EmailMessage()
        message["From"] = settings.EMAIL_FROM
        message["To"] = to
        message["Subject"] = subject
        message.set_content(body)
        try:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as smtp:
                smtp.starttls()
                if settings.SMTP_USER:
                    smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                smtp.send_message(message)
        except Exception as exc:  # noqa: BLE001
            logger.error("Failed to send email to %s: %s", to, exc)

    def send_password_reset(self, to: str, token: str) -> None:
        self.send(
            to,
            "Reset your GovJobs Portal password",
            "Use the token below to reset your password. It expires in 30 minutes.\n\n"
            f"{token}\n\nIf you did not request this, you can ignore this email.",
        )

    def send_new_jobs_digest(self, to: str, count: int) -> None:
        self.send(
            to,
            f"{count} new government jobs published",
            f"{count} new vacancies were added to GovJobs Portal. Sign in to review them.",
        )
