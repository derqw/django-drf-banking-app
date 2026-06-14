from django.urls import path
from .views import (
    HomeView,
    MoneyTransferView,
    MoneyWithdrawelView,
    FundingCardView,
    SpendingHistoryShortView,
    SpendingHistoryLongView,
    FilterView,
    #StepThreeWiew,
    AnalyticsView,
    ProfileView,
    UpdateProfileView
)

urlpatterns = [
    path('UniBank', HomeView.as_view(), name='home page'),
    path('Analytics', AnalyticsView, name='analitics'),
    path('Transfer', MoneyTransferView, name='money transfer'),
    path('Withdraw', MoneyWithdrawelView, name='money withdrawe'),
    path('TopUp', FundingCardView, name='finding card'),
    path('transfer/step1/', FilterView.as_view(), name='?q='),
    path('history/short/', SpendingHistoryShortView.as_view(), name='short history'),
    path('history/long/', SpendingHistoryLongView.as_view(), name='long history'),
    #path('transfer/step3', StepThreeWiew, name='step three'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('update/profile',UpdateProfileView.as_view(), name='update profile')
]
