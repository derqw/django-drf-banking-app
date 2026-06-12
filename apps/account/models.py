import re
import datetime
from django.db import models
from shortuuid.django_fields import ShortUUIDField
from phonenumber_field.modelfields import PhoneNumberField
from django.core.exceptions import ValidationError
from apps.users.models import (
    User
)

ACCOUNT_STATUS = (
    ('inactive', 'Inactive'),
    ('active', 'Active'),
)

class Account(models.Model):
    '''Сам аккаунт номер, баланс и тд'''
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='plural')
    account_number = ShortUUIDField(unique=True, length=13, max_length=30, alphabet='1234567890')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    account_id = ShortUUIDField(unique=True, length=7, max_length=14, prefix='DIDI', alphabet='1234567890')
    account_status = models.CharField(max_length=100, choices=ACCOUNT_STATUS, default='inactive')
    date = models.DateTimeField(auto_now_add=True) 


    class Meta:
        db_table='Account'



class KYC(models.Model):
    '''ДЛЯ РЕГИСТРАЦИИ KYC'''
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    account = models.OneToOneField(Account, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=150)
    avatar = models.ImageField(upload_to='avatars/%Y/%m', null=True, blank=True)
    mobile_number = PhoneNumberField(region='UA', max_length=40)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=120)
    date_of_birth = models.DateField()


    def clean_fields(self, exclude = None):
        super().clean_fields(exclude=exclude)
        
        if self.date_of_birth:
            now = datetime.date.today()
            age = now.year - self.date_of_birth.year - ((now.month, now.day) < (self.date_of_birth.month, self.date_of_birth.day))
            if age < 18 or age >= 100:
                raise ValidationError({'date_of_birth' :'age must be over 18 and under 100'})
            

        if self.full_name:
            if not re.match(r'^[A-Za-zА-Яа-яЁё\s]+$', self.full_name):
                raise ValidationError({'full_name': 'The first and last name must contain only letters'})
            
            len_name = self.full_name.strip().split()
            if len(len_name) != 2:
                raise ValidationError({'full_name': 'The name must consist of exactly two words'})
            

    class Meta:
        db_table='KYC'

        