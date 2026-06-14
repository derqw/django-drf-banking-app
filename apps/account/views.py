import datetime
from django.shortcuts import render
from rest_framework import permissions, status, generics
from rest_framework.response import Response
from unidecode import unidecode
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import api_view, permission_classes, parser_classes
from .models import (
    KYC,
    Account
)
from .serializer import (
    KycSerializer,
)
from apps.core.models import (
    CreditCard,
)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def KycRegisterView(request):
    user = request.user
    serializer = KycSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    if KYC.objects.filter(user=user).exists():
        return Response({
            'error': 'KYC profile already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    

    if Account.objects.filter(user=user).exists():
        return Response({
            'error': 'The bank account is already open'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
    
        account =Account.objects.create(
            user=user,
            account_status='active'
        )
        kyc = serializer.save(user=user, account=account)
        
        full_name = serializer.validated_data.get('full_name')
        CreditCard.objects.create(
            user=user,
            account=account,
            name=unidecode(full_name).upper(),
            month=2,
            year=32
        )


    except Exception:
        return Response({'error': 'Error creating card and account'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'message' 'You have successfully completed KYC authorization and are waiting for your card to be created.'
    }, status=status.HTTP_200_OK)