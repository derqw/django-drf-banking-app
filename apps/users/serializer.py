from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.html import escape
from django.contrib.auth.password_validation import validate_password
from .models import (
    User
)


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    class Meta:
        model = User
        fields = ('login', 'email','password')
        

    def validate_email(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('error in email')
        return value.strip().lower()
    

    def validate_login(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('error in login')
        return escape(value.strip())
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
        

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), username=email, password=password)
            if not user:
                raise serializers.ValidationError('User no found')
            if not user.is_active:
                raise serializers.ValidationError('Account is disabled')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Incorrect email address or password')
        



class ChangePasswordSerializer(serializers.Serializer):
    '''Сериалайзер для обновления пароля'''
    old_password = serializers.CharField(required=True)

    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate_old_password(self, value):
        
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('The old password is bad')
        return value
    
    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user