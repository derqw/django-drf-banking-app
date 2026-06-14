from django.db import models
from shortuuid.django_fields import ShortUUIDField
from django.core.exceptions import ValidationError
from apps.users.models import (
    User,
)
from apps.account.models import (
    Account,
)
TRANSACTION_TYPE = (
    ('transfer','Перевод'),
    ('receive','Получение'),
    ('withdraw','Снятие'),
    ('replenishment','Пополнение'),
    ('none','Нет')
)
TRANSACTION_STATUS = (
    ('failed','Ошибка'),
    ('completed','Завершено'),
    # ПОТОМ ПОДУМАТЬ НУЖНО ДОБАВЛЯТЬ ИЛИ НЕТ
    ('pending','В ожидании'),
   # ('processing','В обработке'),
    #('request_sent','Запрос отправлен'),
    #('request_processing','Запрос обрабатывается'),
    ('request_settled','Запрос завершен')
)

class CreditCard(models.Model):
    '''МОДЕЛЬ ДЛЯ САМОЙ КАРТЫ ПОЛЬЗОВАТЕЛЯ КОТОРАЯ ССЫЛАЕТСЯ НА БАЛАНС С МОДЕЛИ ACCOUNT'''
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cards')
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='cards')
    number_card = ShortUUIDField(unique=True, length=12, max_length=16,prefix='3222', alphabet='1234567890')
    cvc = ShortUUIDField(length=3, max_length=3, alphabet='1234567890')
    name = models.CharField(blank=True, max_length=100)
    type_credit_card = models.CharField(default='visa')
    month = models.IntegerField()
    year = models.IntegerField() 
    date = models.DateTimeField(auto_now_add=True)


    class Meta:
        db_table='CreditCard'
        verbose_name = 'Credi Card'
        verbose_name_plural = 'Credit Cards'


class Transaction(models.Model):
    '''ЭТО МОДЕЛЬ БУДЕТ НУЖНА ДЛЯ ТОГО ЧТОБ СОХРАНЯТЬ ИСТОРИЮ ТРАНЗАКЦИЙ, ТИП ТРАНЗАКЦИЙ, 
    ПОЛУЧАЕТСЯ ДЕНЕГ ОТПРАВИТЕЛЯ ДЕНЕГ. ЭТОГО ДЛЯ ТОГО ЧТОБЫ БЫЛА ЛОГИКА С ДЕБИТОМ И КРЕДЕТОМ
    '''
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='transaction')
    amount = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    payment_description = models.CharField(max_length=1000, null=True, blank=True)
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sender')
    recipient = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='recipient')
    sender_account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, related_name='sender_account')
    recipient_account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, related_name='recipient_account')
    sender_card = models.ForeignKey(CreditCard, on_delete=models.CASCADE, null=True, related_name='sender_card')
    recipient_card = models.ForeignKey(CreditCard, on_delete=models.CASCADE, null=True, related_name='recipient_card')

    status = models.CharField(choices=TRANSACTION_STATUS, max_length=100, default="pending")
    transaction_type = models.CharField(choices=TRANSACTION_TYPE, max_length=100, default="none")
    
    date = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    
    def clean_fields(self, exclude = None):
        '''ГЛЯНУТЬ МОЖЕТ НУЖНО ДОДЕЛАТЬ ПРОВЕРКУ'''
        super().clean_fields(exclude=exclude)

        if self.amount <= 0:
            raise ValidationError({'error': 'A transaction cannot be negative'})
    


    class Meta:
        db_table='Transaction'
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'


