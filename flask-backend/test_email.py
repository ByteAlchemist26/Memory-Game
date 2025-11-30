import os
from dotenv import load_dotenv
import smtplib
from email.message import EmailMessage

load_dotenv()

smtp_host = os.getenv("SMTP_HOST")
smtp_port = int(os.getenv("SMTP_PORT", "587"))
smtp_user = os.getenv("SMTP_USER")
smtp_pass = os.getenv("SMTP_PASS")
smtp_from = os.getenv("SMTP_FROM", smtp_user)

print(f"Testing SMTP Configuration...")
print(f"SMTP Host: {smtp_host}")
print(f"SMTP Port: {smtp_port}")
print(f"SMTP User: {smtp_user}")
print(f"SMTP Pass: {'*' * len(smtp_pass)}")
print(f"SMTP From: {smtp_from}")
print("\n" + "="*60)

try:
    msg = EmailMessage()
    msg["From"] = smtp_from
    msg["To"] = smtp_user
    msg["Subject"] = "Test Email - Memory Game SMTP"
    msg.set_content("If you see this, SMTP is working correctly!")

    print("Connecting to SMTP server...")
    with smtplib.SMTP(smtp_host, smtp_port) as server:
        print("Connected! Starting TLS...")
        server.ehlo()
        server.starttls()
        server.ehlo()
        print("TLS started! Logging in...")
        server.login(smtp_user, smtp_pass)
        print("Login successful! Sending email...")
        server.send_message(msg)
    
    print("="*60)
    print("✅ SUCCESS! Email sent successfully!")
    print(f"Check your email: {smtp_user}")
    print("="*60)

except Exception as e:
    print("="*60)
    print(f"❌ ERROR: {str(e)}")
    print("="*60)
    print("\nTroubleshooting:")
    print("1. Check if you used a NEW app password (not old one)")
    print("2. Make sure 2-Step Verification is ON")
    print("3. Verify email and password in .env file")
    print("4. Try generating a NEW app password")