from rest_framework import serializers
from datetime import date
from apps.users.models import (
    User
)
from .models import (
    Account,
    KYC,
)



class KycSerializer(serializers.ModelSerializer):

    date_of_birth = serializers.DateField(format="%d.%m.%Y", input_formats=["%d.%m.%Y"])
    avatar = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = KYC
        fields = ('full_name', 'avatar', 'country', 'city', 'mobile_number', 'date_of_birth')


class FilterKycSerializer(serializers.ModelSerializer):
    class Meta:
        model=KYC
        fields = ('avatar', 'full_name')