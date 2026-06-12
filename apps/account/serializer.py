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

    dete_of_birth = serializers.DateField(format="%d.%m.%Y", input_formats=("%d.%m.%Y"))

    class Meta:
        model = KYC
        fiedls = ('full_name', 'avatar', 'country', 'city', 'mobile_number', 'date_of_birth')
