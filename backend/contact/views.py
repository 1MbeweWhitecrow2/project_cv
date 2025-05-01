from django.core.mail import send_mail, BadHeaderError
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.conf import settings
from django.core.cache import cache

@api_view(["POST"])
def send_contact_email(request):
    """API to send emails with rate limiting."""
    data = request.data
    user_ip = request.META.get("REMOTE_ADDR")

    if cache.get(user_ip):
        return Response({"error": "Too many requests. Try again later."}, status=429)

    cache.set(user_ip, "sent", timeout=60)

    # Validate required fields
    required_fields = ["name", "email", "message"]
    missing_fields = [field for field in required_fields if not data.get(field)]

    if missing_fields:
        return Response({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

    try:
        send_mail(
            subject=f"New message from {data.get('name')}",
            message=f"{data.get('message')}\n\nSender's email: {data.get('email')}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.DEFAULT_FROM_EMAIL]  # Email delivered to your own email address
        )
        return Response({"message": "Email sent successfully!"}, status=200)
    except BadHeaderError:
        return Response({"error": "Invalid header found."}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


