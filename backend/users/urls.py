from django.urls import path
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet, RegisterView

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = router.urls + [
    path('register/', RegisterView.as_view(), name='user-register'),
]