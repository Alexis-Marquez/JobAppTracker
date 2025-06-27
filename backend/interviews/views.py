from rest_framework import viewsets
from .models import Interview
from .serializers import InterviewSerializer

class InterviewViewSet(viewsets.ModelViewSet):
    queryset = Interview.objects.all()
    serializer_class = InterviewSerializer

    def get_queryset(self):
        queryset = Interview.objects.all()
        company_pk = self.kwargs.get('company_pk')
        application_pk = self.kwargs.get('application_pk')

        if company_pk:
            queryset = queryset.filter(company_id=company_pk)
        if application_pk:
            queryset = queryset.filter(application_id=application_pk)

        return queryset
