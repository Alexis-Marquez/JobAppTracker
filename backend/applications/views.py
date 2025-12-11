from django.shortcuts import render

from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated

from .models import Application
from .serializers import ApplicationSerializer
from .permissions import IsOwner

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    filter_backends = [filters.SearchFilter]
    search_fields = ['company__name', 'position_title']
    def get_queryset(self):
        queryset = Application.objects.filter(user=self.request.user)

        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        return queryset

# Post: {"id":1,"company":{"name":"OpenAI","website":"https://openai.com"},
# "location":{"id":1,"city":"Austin","country":"United States","location_type":"onsite","state":"TX"},"resume_used"
# :null,"user":1,"is_active":true,"days_since_applied":0,"application_date":"2025-07-09T13:00:00Z",
# "benefits":"","description":"Great job","last_updated":"2025-07-09T18:24:02.638170Z","pay":"",
# "position_title":"Software Engineer","requirements":"","status":"applied"}

# Get: {"count":1,"next":null,"previous":null,"results":[{"id":1,
# "company":{"name":"OpenAI","website":"https://openai.com"},"location":{"id":1,"city":"Austin","country":"United States","l
# ocation_type":"onsite","state":"TX"},"resume_used":null,"user":1,
# "is_active":true,"days_since_applied":0,"application_date":"2025-07-09T13:00:00Z","benefits":"",
# "description":"Great job","last_updated":"2025-07-09T18:24:02.638170Z","pay":"","position_title":"Software Engineer","requirements":"","status":"applied"}]}

from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.core.cache import cache
from .models import Application
from .services.stats import get_application_stats

class ApplicationStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        cache_key = f"application_stats_{user.id}"

        data = cache.get(cache_key)
        if not data:
            data = get_application_stats(user)
            cache.set(cache_key, data, 60 * 5)  # cache for 5 minutes

        return Response(data)
