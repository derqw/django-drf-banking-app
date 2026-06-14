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
    ChangePasswordSerializer,
)
from apps.account.models import(
    KYC
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
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']

    login(request, user)
    refresh = RefreshToken.for_user(user)

    flag = KYC.objects.filter(user=user).exists()
    return Response({
        'user': UserRegisterSerializer(user).data,
        'flag': flag,
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'message' : 'The user has logged in successfully'

    }, status=status.HTTP_201_CREATED)



@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def LogOutView(request):
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception:
        return Response({
            'error': 'Invalid token'
        }, status=status.HTTP_400_BAD_REQUEST)
    

class ChangePasswordView(generics.UpdateAPIView):
    '''Обновление пароля'''
    serializer_class = ChangePasswordSerializer 
    permission_classes = [permissions.IsAuthenticated]  

    def get_object(self):
        return self.request.user 

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) 
        serializer.save() 

        return Response({
            'message': 'Password changed'
        },status=status.HTTP_200_OK)
    