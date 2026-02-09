from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'subscription_tier', 'is_verified', 'is_staff')
    list_filter = ('role', 'subscription_tier', 'is_verified', 'is_staff', 'is_superuser')
    search_fields = ('email', 'first_name', 'last_name', 'phone_number')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone_number', 'avatar')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Role & Subscription', {'fields': ('role', 'subscription_tier', 'is_verified')}),
    )
