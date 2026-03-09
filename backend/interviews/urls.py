from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from companies.views import CompanyViewSet
from applications.views import ApplicationViewSet
from interviews.views import InterviewViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)

companies_router = NestedDefaultRouter(router, r'companies', lookup='company')
companies_router.register(r'applications', ApplicationViewSet, basename='company-applications')

applications_router = NestedDefaultRouter(companies_router, r'applications', lookup='application')
applications_router.register(r'interviews', InterviewViewSet, basename='application-interviews')


urlpatterns = router.urls + companies_router.urls + applications_router.urls
