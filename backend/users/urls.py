from django.urls import path
from .views import register_user, login_user, activate_account

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
    path('activate/<str:token>/', activate_account, name='activate_account'),
]
