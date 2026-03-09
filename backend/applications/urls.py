from django.urls import path
from rest_framework.routers import DefaultRouter
from applications.views import ApplicationStatsView, ApplicationViewSet

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet, basename='application')

urlpatterns = [
    path('applications/stats/', ApplicationStatsView.as_view(), name='application-stats'),
]

urlpatterns += router.urls
