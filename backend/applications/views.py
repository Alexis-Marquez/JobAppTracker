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