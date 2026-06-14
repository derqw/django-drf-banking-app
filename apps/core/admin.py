from django.contrib import admin
from .models import CreditCard, Transaction

@admin.register(CreditCard)
class CreditCardAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'number_card', 'type_credit_card', 'date')
    list_filter = ('type_credit_card',)
    search_fields = ('number_card', 'user__email')
    readonly_fields = ('number_card', 'cvc', 'date')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient', 'amount', 'status', 'transaction_type', 'date')
    list_filter = ('status', 'transaction_type')
    search_fields = ('sender__email', 'recipient__email', 'payment_description')
    readonly_fields = ('date', 'updated')
    
    # Удобный выбор пользователей в выпадающем списке
    autocomplete_fields = ['sender', 'recipient', 'user']