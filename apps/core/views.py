import datetime
from django.shortcuts import render
from rest_framework import permissions, status, generics
from rest_framework.response import Response
from django.db import models
import random
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes
from .filters import CardNumberFilter
from apps.account.models import KYC
from apps.users.models import(
    User
)
from .models import (
    Transaction,
    CreditCard
)
from .services import (
    MoneyTransaction
)
from .serilalizer import (
    HomeSerialzier,
    MoneyTransferSerializer,
    OperationsWithMoneySerializer,
    SpendingHistory,
    FilterSerializer,
    ProfileSerializer,
    UpdateProfileSerializer,
)

class HomeView(generics.ListAPIView):
    '''ГЛАВНАя страница банка'''
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = HomeSerialzier

    def get_queryset(self):
        return CreditCard.objects.filter(user=self.request.user)



@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def MoneyTransferView(request):
    '''перевод'''
    serializer = MoneyTransferSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    amount = serializer.validated_data['amount']
    payment_description = serializer.validated_data['payment_description']
    recipient_card = serializer.validated_data['recipient_card']

    try:
        MoneyTransaction.MoneyTransfer(request.user, amount, payment_description, recipient_card)
        return Response({
            'status': 'success',
            'message': 'Translation completed successfully'
        }, status=status.HTTP_200_OK)
    except Exception:
        return Response({
            'error' : 'error'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def MoneyWithdrawelView(request):
    '''снятие'''
    serializer = OperationsWithMoneySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    amount = serializer.validated_data['amount']

    try:
        MoneyTransaction.WithdrawelMoney(request.user, amount)
        return Response({
            'status': 'success',
            'message': 'Translation completed successfully'
        }, status=status.HTTP_200_OK)
    except Exception:
        code = ''.join([str(random.randint(0, 9)) for _ in range(12)])
        return Response({
            'error' : 'error',
            'code': code
        }, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def FundingCardView(request):
    '''пополнение'''
    serializer = OperationsWithMoneySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    amount = serializer.validated_data['amount']

    try:
        MoneyTransaction.ReplenishmentCard(request.user, amount)
        return Response({
            'status': 'success',
            'message': 'Translation completed successfully'
        }, status=status.HTTP_200_OK)
    except Exception:
        return Response ({
            'error' : 'error'
        }, status=status.HTTP_400_BAD_REQUEST)



class SpendingHistoryShortView(generics.ListAPIView):
    '''операция историй для главной'''
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SpendingHistory

    def get_queryset(self):
        user=self.request.user
        return Transaction.objects.filter(
            models.Q(sender=user) | models.Q(recipient=user)
        ).select_related('sender', 'recipient','sender_card', 'recipient_card').order_by('-date')[:5]
    

class SpendingHistoryLongView(generics.ListAPIView):
    '''операция история вся'''
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SpendingHistory

    def get_queryset(self):
        user=self.request.user
        return Transaction.objects.filter(
            models.Q(sender=user) | models.Q(recipient=user)
        ).select_related('sender', 'recipient','sender_card', 'recipient_card').order_by('-date')


class FilterView(generics.ListAPIView):
    ''''''
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FilterSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CardNumberFilter

    def get_queryset(self):

        q = self.request.query_params.get('q')
        if not q:
            raise ValidationError({'q': 'To find a card, you need its number'})

        
        if len(q.strip()) != 16:
            raise ValidationError({'q':  'The card number must consist of exactly 16 digits.'})
        
        
        return CreditCard.objects.exclude(user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def AnalyticsView(request):
    analytics = MoneyTransaction.UserAnalitics(request.user)
    return Response(analytics)



class ProfileView(generics.ListAPIView):
    '''профиль'''
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_queryset(self):
        return KYC.objects.filter(user=self.request.user)
    

class UpdateProfileView(generics.UpdateAPIView):
    
    permission_classes=[permissions.IsAuthenticated]
    serializer_class = UpdateProfileSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


    def get_object(self):
        
        return KYC.objects.get(user=self.request.user)

