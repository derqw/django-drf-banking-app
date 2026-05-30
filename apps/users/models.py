from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager




class UserManager(BaseUserManager):
    def create_user(self,login, email, password=None, **extra_fields):
        if not email:
            raise ValueError('You can`t register without email')
        email = self.normalize_email(email)
        user = self.model(email=email, login=login, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
        

    def create_superuser(self, login, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('SuperUser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('SuperUser must have is_superuser=True') 

        return self.create_user(email, login, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    '''РЕГИСТРАЦИЯ И АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ'''

    login = models.CharField(max_length=120)
    email = models.EmailField(unique=True, max_length=225)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELDS = 'email'

    REQUIRED_FIELDS = ['login']

    class Meta:
        db_table = 'User'
        verbose_name = 'User'
        verbose_name_plural = 'Users'


    def __sts__(self):
        return self.email
