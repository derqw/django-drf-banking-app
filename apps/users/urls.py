from django.urls import path
from rest_framework_simplejwt.views import ( 
    TokenRefreshView,
)
from .views import (
    RegisterView,
    LoginView,
)



urlpatterns = [
    path('register/', RegisterView, name='register'),
    path('login/', LoginView, name='login'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]
