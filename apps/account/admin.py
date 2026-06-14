from django.contrib import admin
from .models import Account, KYC

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('accountID', 'user', 'account_number', 'balance', 'account_status')
    list_filter = ('account_status',)
    search_fields = ('accountID', 'account_number', 'user__email')
    readonly_fields = ('accountID', 'account_number', 'date')

@admin.register(KYC)
class KYCAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'mobile_number', 'country')
    search_fields = ('user__email', 'full_name', 'mobile_number')
    list_filter = ('country',)