from rest_framework import serializers
from apps.account.models import Account
from apps.account.serializer import (
    FilterKycSerializer
)
from apps.users.models import (
    User
)
from apps.account.models import (
    KYC
)
from .models import (
    CreditCard,
    Transaction
)


class HomeSerialzier(serializers.ModelSerializer):
    '''Сериализатор для главной страниц'''
    balance = serializers.CharField(source='account.balance', read_only=True)
    class Meta:
        model = CreditCard
        fields = ('number_card', 'cvc','year', 'month','name', 'type_credit_card', 'balance')


class MoneyTransferSerializer(serializers.ModelSerializer):
    '''для перевода'''
    recipient_card = serializers.CharField(write_only=True, max_length=16)
    class Meta:
        model = Transaction
        fields = ('recipient_card', 'amount', 'payment_description')

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('The amount must be greater than zero')
        return value
    
    def validate_recipient_card(self,value):
        if not CreditCard.objects.filter(number_card=value).exists():
            raise serializers.ValidationError('Recipient card not found.')
        return value



class OperationsWithMoneySerializer(serializers.ModelSerializer):
    '''для снятия'''
    class Meta:
        model = Transaction
        fields = ('amount',)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('The amount must be greater than zero')
        return value


class SpendingHistory(serializers.ModelSerializer):
    '''для истории'''
    sender_card_number = serializers.CharField(source='sender_card.number_card',read_only=True)
    amount_display = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ('amount','amount_display', 'sender_card_number', 'date')

    def get_amount_display(self, obj):
        if obj.transaction_type == "replenishment":
            return "plus"
        

        if obj.transaction_type == "withdrawal":
            return "minus"
            
        user = self.context['request'].user
        if obj.sender == user:
            return "minus"
            
        return "plus"



class FilterSerializer(serializers.ModelSerializer):
    '''для шага первого где поиск пользователя по карте
        ава имя номре карты
    '''

    email = serializers.CharField(source='user.email', read_only=True)
    avatar = serializers.ImageField(source='account.kyc.avatar', read_only=True)
    full_name = serializers.CharField(source='account.kyc.full_name', read_only=True)
    class Meta:
        model = CreditCard
        fields = ('number_card', 'email','avatar', 'full_name')





class ProfileSerializer(serializers.ModelSerializer):
    card = serializers.SerializerMethodField()
    class Meta:
        model = KYC
        fields = ('full_name', 'city','country','card','avatar','mobile_number')

    def get_card(self, obj):
        card = obj.account.cards.first() 
        if card:
            return HomeSerialzier(card).data
        return None

class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = KYC
        fields = ('city','country','mobile_number','avatar')