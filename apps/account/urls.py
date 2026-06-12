from django.urls import path
from .views import (
    KycRegisterView,
)


urlpatterns = [
    path('verification/', KycRegisterView, name='register-kyc')
]
