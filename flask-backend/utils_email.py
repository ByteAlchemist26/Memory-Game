# flask-backend/utils_email.py
import os
import smtplib
from email.message import EmailMessage

def send_email(receiver: str, subject: str, body: str):
    """
    Send email using SMTP. Configure via environment variables:
      SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM (optional)
    For Gmail use SMTP_HOST=smtp.gmail.com and SMTP_PORT=587 and an app password.
    """
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    smtp_from = os.getenv("SMTP_FROM", smtp_user)

    if not all([smtp_host, smtp_port, smtp_user, smtp_pass]):
        raise RuntimeError("SMTP not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS env vars.")

    msg = EmailMessage()
    msg["From"] = smtp_from
    msg["To"] = receiver
    msg["Subject"] = subject
    msg.set_content(body)

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.ehlo()
        # use TLS if port 587
        if smtp_port == 587:
            server.starttls()
            server.ehlo()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
