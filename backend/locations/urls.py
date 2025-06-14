from rest_framework.routers import DefaultRouter
from locations.views import LocationViewSet

router = DefaultRouter()
router.register(r'locations', LocationViewSet)

urlpatterns = router.urls
