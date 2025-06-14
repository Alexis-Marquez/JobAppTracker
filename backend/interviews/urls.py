from rest_framework.routers import DefaultRouter
from interviews.views import InterviewViewSet
from companies.views import CompanyViewSet

router = DefaultRouter()
router.register(r'interviews', InterviewViewSet)

urlpatterns = router.urls
