from rest_framework.routers import DefaultRouter
from resumes.views import ResumeViewSet

router = DefaultRouter()
router.register(r'resumes', ResumeViewSet)

urlpatterns = router.urls
