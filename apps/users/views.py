from django.shortcuts import render
from rest_framework import permissions,status,generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login
from .models import User
from .serializer import (
    UserRegisterSerializer,
    UserLoginSerializer,
)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def RegisterView(request):
    serializer = UserRegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()


    refresh = RefreshToken.for_user(user)

    return Response({
        'user': UserRegisterSerializer(user).data,
        'refresh': str(refresh),
        'access' : str(refresh.access_token),
        'message' : 'User has successfully register'
    },status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def LoginView(request):
    serializer = UserLoginSerializer(data=request.date)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']

    login(request, user)
    refresh = RefreshToken.for_user(user)

    return Response({
        'user': UserRegisterSerializer(user).data,
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'message' : 'The user has logged in successfully'

    }, status=status.HTTP_201_CREATED)