import datetime
from django.shortcuts import render
from rest_framework import permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import (
    KYC,
    Account
)
from .serializer import (
    KycSerializer,

)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def KycRegisterView(request):
    user = request.user
    serializer = KycSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    if KYC.objects.filter(user=user).exists():
        return Response({
            'error': 'KYC profile already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    

    if Account.objects.filter(user=user):
        return Response({
            'error': 'The bank account is already open'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        account = Account.objects.create(
            user=user,
            account_status='active'
        )


        # КОГДА СОЗДАМ КАРТУ СЮДА ДОБВАИТЬ БОАВЛЕНИЕ

    except Exception:
        return Response({'error': 'Error creating card and account'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'message' 'ПОТОМ ДОБАВИТЬ СЕРИАЛИЗАТОР ЧТОБ ПЕРЕКИДЫВАЛО НА ГЛАНВУЮ'
    }, status=status.HTTP_200_OK)