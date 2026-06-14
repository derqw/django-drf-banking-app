from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('login', 'email', 'is_staff', 'date_joined')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('login', 'email')
    ordering = ('-date_joined',)
    
    # Скрываем password из формы редактирования
    fieldsets = (
        (None, {'fields': ('login', 'email', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('date_joined',)}),
    )