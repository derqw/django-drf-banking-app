from django_filters import rest_framework as filters
from django.db.models import Q
from .models import CreditCard
from rest_framework.exceptions import ValidationError, NotFound

class CardNumberFilter(filters.FilterSet):

    q = filters.CharFilter(method='global_search', label='Search')


    class Meta:
        model = CreditCard
        fields = ('q',)



    def global_search(self,queryset,name,value):
        value=value.strip()
        
        if not value or len(value) != 16:
            return queryset.none()
        

        return queryset.filter(
            Q(number_card__icontains=value)
        )

