from django.db import transaction
from rest_framework.exceptions import ValidationError
from .models import CreditCard, Transaction
from django.db.models import Sum


class MoneyTransaction:

    @staticmethod
    def ReplenishmentCard(user, amount): 
        '''Пополнения карты'''

        with transaction.atomic():
            user_card = CreditCard.objects.select_related('account').get(user=user)
            user_balance = user_card.account

            user_balance.balance += amount
            user_balance.save()

            money =Transaction.objects.create(
                user=user,
                amount=amount,
                sender=user,
                status='request_settled',
                transaction_type="replenishment"
                
            )
            
        return money

    @staticmethod
    def WithdrawelMoney(user, amount):
        '''Снятие денег'''
        with transaction.atomic():
            user_card = CreditCard.objects.select_related('account').get(user=user)
            user_balance = user_card.account

            if user_balance.balance < amount:
                raise ValidationError('There are not enough funds on the balance to withdraw them.')
            
            user_balance.balance -= amount
            user_balance.save()
            
            money =Transaction.objects.create(
                user=user,
                amount=amount,
                sender=user,
                status='request_settled',
                transaction_type="withdraw"
                
            )

            return money
        

    @staticmethod
    def MoneyTransfer(user, amount, payment_description, recipient_card_number):
        '''ДЛЯ ПЕРЕВОДА ДЕНЕГ'''
        with transaction.atomic():
        
            sender_card = CreditCard.objects.select_for_update().select_related('account').get(user=user)

            try:
                recipient_card = CreditCard.objects.select_for_update().select_related('account').get(number_card=recipient_card_number)
            except CreditCard.DoesNotExist:
                raise ValidationError('Recipient card not found')
            if sender_card.number_card == recipient_card.number_card:
                raise ValidationError("I can't send money to my card")
            if sender_card.account.balance < amount:
                raise ValidationError('It is impossible to transfer money due to insufficient funds.')

            
            sender_card.account.balance -= amount
            sender_card.account.save()

            recipient_card.account.balance += amount
            recipient_card.account.save()

            money = Transaction.objects.create(
            user=user,
            amount=amount,
            sender=user,
            recipient=recipient_card.user,
            sender_account=sender_card.account,
            recipient_account=recipient_card.account,
            sender_card=sender_card,
            payment_description=payment_description,
            recipient_card=recipient_card,
            status='request_settled',
            transaction_type="transfer"
        )

        return money
    

    @staticmethod
    def UserAnalitics(user):
        transact = Transaction.objects.filter(user=user)
        sum = transact.aggregate(total=Sum('amount'))['total'] or 0

        data = {
        "transfer": 0, "receive": 0, "withdraw": 0, "replenishment": 0
        }

        if sum == 0:
            return data
        
        stats = transact.values('transaction_type').annotate(total=Sum('amount'))
    
        for item in stats:
            t_type = item['transaction_type']
            if t_type in data:
                data[t_type] = round((float(item['total']) / float(sum)) * 100, 2)
            
        return data