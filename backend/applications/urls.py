from rest_framework.routers import DefaultRouter
from applications.views import ApplicationViewSet

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet)

urlpatterns = router.urls
