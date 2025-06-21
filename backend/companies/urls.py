from rest_framework.routers import DefaultRouter
from companies.views import CompanyViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)

urlpatterns = router.urls
