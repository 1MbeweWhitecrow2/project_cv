from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.shortcuts import get_object_or_404
from django_ratelimit.decorators import ratelimit
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .models import CustomUser 
from django.contrib.auth import get_user_model
from .utils import verify_recaptcha  # 👉 dodajemy import z utils.py
import uuid
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from axes.helpers import get_failure_limit
from axes.handlers.proxy import AxesProxyHandler



User = get_user_model()
frontend_base_url = settings.FRONTEND_BASE_URL


    
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if AxesProxyHandler.is_locked(request, credentials={'username': username}):
        return Response(
            {"error": "Too many failed login attempts. Your account is locked for 2 hours."},
            status=status.HTTP_403_FORBIDDEN
        )

    user = authenticate(request=request, username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    else:
        remaining_attempts = AxesProxyHandler.get_failures(request, credentials={'username': username})
        return Response(
            {"error": f"Invalid credentials. Remaining attempts: {remaining_attempts}"},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['GET'])
def activate_account(request, token):
    print("Token received:", token)
    user = get_object_or_404(CustomUser, activation_token=token)
    user.is_active = True
    user.activation_token = None
    user.save()
    print("User activated:", user.username)
    return Response({"message": "Account activated successfully."}, status=status.HTTP_200_OK)

   

@api_view(['POST'])
@ratelimit(key='ip', rate='3/h', block=True)
def register_user(request):
    data = request.data

    # Sprawdzenie obecności wymaganych pól
    required_fields = ['username', 'email', 'password', 'recaptcha']
    for field in required_fields:
        if field not in data:
            return Response({"error": f"Missing required field: {field}"}, status=status.HTTP_400_BAD_REQUEST)

    # Walidacja długości
    if len(data['username']) > 20:
        return Response({"error": "Username must be max 20 characters"}, status=status.HTTP_400_BAD_REQUEST)
    if len(data['email']) > 40:
        return Response({"error": "Email must be max 40 characters"}, status=status.HTTP_400_BAD_REQUEST)
    if len(data['password']) > 20:
        return Response({"error": "Password must be max 20 characters"}, status=status.HTTP_400_BAD_REQUEST)

    # Globalne ograniczenie: 10 rejestracji na godzinę
    one_hour_ago = timezone.now() - timedelta(hours=1)
    recent_registrations = CustomUser.objects.filter(date_joined__gte=one_hour_ago).count()
    if recent_registrations >= 10:
        return Response({"error": "Too many registrations at the moment. Please try again later."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

    # Sprawdzenie unikalności
    if CustomUser.objects.filter(username=data['username']).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
    if CustomUser.objects.filter(email=data['email']).exists():
        return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Weryfikacja reCAPTCHA za pomocą utils
    if not verify_recaptcha(data['recaptcha']):
        return Response({"error": "Invalid reCAPTCHA"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.create(
            username=data['username'],
            email=data['email'],
            password=make_password(data['password']),
            is_active=False,
            activation_token=str(uuid.uuid4())
        )

        activation_link = f"{frontend_base_url}/activate/{user.activation_token}/"
        send_mail(
            'Activate your account',
            f'Click the link to activate your account: {activation_link}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )


        return Response({"message": "Account created. Please verify your email."}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




